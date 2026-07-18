#!/usr/bin/env python3
# Instructions:
#  - Open cmd in Kingdoms-Wiki folder.
#  - Run "py local.py"
#  - Use the menu.

import shutil
import subprocess
import sys
import os
import platform
import stat
import msvcrt
import json
from pathlib import Path
import json
from http.server import HTTPServer, SimpleHTTPRequestHandler
from functools import partial

import threading
import time
import webbrowser

PACKAGE_JSON = Path("package.json")
WIKI_REPO = "https://github.com/CryptoMorin/KingdomsX.wiki.git"
SERVER_DIR = Path(".")
DOCS_DIR = SERVER_DIR / "docs"
BUILD_DIR = SERVER_DIR / "build"
REPO_DOCS_DIR = SERVER_DIR / "repo-docs"
NPM = "npm.cmd" if os.name == "nt" else "npm"
SERVER_PORT = 8000
AUTO_OPEN_IN_BROWSER = True
CWD = os.getcwd()

# Colors
RESET = "\033[0m"
BOLD = "\033[1m"
CYAN = "\033[96m"
GREEN = "\033[92m"
YELLOW = "\033[93m"
RED = "\033[91m"
RESET = "\033[0m"
DARK_GRAY = "\033[90m"
LIGHT_BLUE = "\033[94m"
server: HTTPServer = None

def run(cmd, cwd=None):
    print(f"\n> {' '.join(cmd)}")
    subprocess.run(cmd, cwd=cwd, check=True)


def clear():
    # os.system("cls" if os.name == "nt" else "clear")
    if os.name == "nt":
        subprocess.run(["cmd", "/c", "cls"])
    else:
        subprocess.run(["clear"])


def pause():
    print("\nPress any key to go back to the main menu...")
    msvcrt.getch()


def remove_readonly(func, path, exc):
    os.chmod(path, stat.S_IWRITE)
    func(path)

def ensure_setup():
    SERVER_DIR.mkdir(exist_ok=True)

def clone_or_update_wiki():
    print("Pulling wiki changes...")

    if REPO_DOCS_DIR.exists():
        print("Removing existing docs directory...")
        remove_directory(REPO_DOCS_DIR)
    if DOCS_DIR.exists():
        remove_directory(DOCS_DIR)   

    run([
        "git",
        "clone",
        "--branch",
        "master",
        WIKI_REPO,
        str(REPO_DOCS_DIR)
    ])
    shutil.copytree(REPO_DOCS_DIR, DOCS_DIR)
    github_md_preprocessor()


def github_md_preprocessor():
    run([
        sys.executable,
        "./scripts/github_md_preprocessor.py",
        str(DOCS_DIR)
    ])

def install_dependencies():
    print("Installing dependencies...")
    run([NPM, "install"])

def build_site():
    print("Running Docusaurus build...")
    run([NPM, "run", "build", "--", "--dev"])

def write_translations():
    print("Writing Docusaurus translations...")
    run([NPM, "run", "write-translations"])

def open_browser(resource_loc):
    (addr, port) = resource_loc
    url = f"http://{addr}:{port}/"

    print("Opening URL: " + url)
    time.sleep(1)
    webbrowser.open(url)

class MyHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # We can't reliably do a hard reload from the browser JavaScript.
        if self.path.startswith("/api/"):
            self.send_header("Cache-Control", "no-store")
        else:
            self.send_header("Cache-Control", "public, max-age=10")
        super().end_headers()

    def send_error(self, code, message=None, explain=None):
        if code == 404:
            path = Path(self.directory) / "404.html"
            if path.exists():
                self.send_response(404)
                self.send_header("Content-Type", "text/html")
                self.end_headers()
                with open(path, "rb") as f:
                    self.wfile.write(f.read())
                return

        super().send_error(code, message, explain)

    def do_GET(self):
        try:
            if self.path == "/api/v1/reload":
                try:
                    ensure_setup()
                    rebuild()
                    self.send_response(200)
                    response = {
                        "ok": True,
                        "message": "Reloaded successfully."
                    }
                except Exception as e:
                    print(f"Internal error while reloading: {e}")
                    self.send_response(500)
                    response = {
                        "ok": False,
                        "message": str(e)
                    }
                
                data = json.dumps(response).encode("utf-8")
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.send_header("Content-Length", str(len(data)))
                self.end_headers()

                # We don't need to restart the server itself.
                # It shouldn't hold any "lock" to any of the "build" folder files.
                self.wfile.write(data)
                return

            # Serve existing files normally
            path = Path(self.directory) / self.path.lstrip("/")
            if path.exists() and path.is_file():
                return super().do_GET()

            # SPA fallback
            self.path = "/index.html"
            return super().do_GET()
        except ConnectionAbortedError as e:
            print(f"{YELLOW}Warning: Connection was aborted from client: {e}{RESET}")

def serve_site():
    global server
    handler = partial(MyHandler, directory=BUILD_DIR)
    server = HTTPServer(("localhost", SERVER_PORT), handler)

    print("\nStarting local server...")
    print("Open http://localhost:" + str(SERVER_PORT))
    print("Press Ctrl+C to stop the server\n")

    try:
        if AUTO_OPEN_IN_BROWSER:
            threading.Thread(
                target=open_browser,
                args=(server.server_address,),
                daemon=True
            ).start()

        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
        server.server_close()


def rebuild():
    # It's pointless to run these, they rarely change.
    # The user should pull changes instead if they want to update this.
    #
    # remove_directory(DOCS_DIR)
    # shutil.copytree(REPO_DOCS_DIR, DOCS_DIR)
    # github_md_preprocessor()

    remove_directory(SERVER_DIR / ".docusaurus")
    remove_directory(BUILD_DIR)
    build_site()

def remove_directory(path):
    path = str(path)
    system = platform.system()

    print("Deleting " + str(path))
    if system == "Windows":
        # Equivalent to: rm -fr
        # using shutil is too slow on Windows.
        subprocess.run(
            ["cmd", "/c", "rmdir", "/S", "/Q", path],
            check=False
        )
    elif system in ("Linux", "Darwin"):  # Linux/macOS
        shutil.rmtree(path, onexc=remove_readonly)
    else:
        raise OSError(f"Unsupported operating system: {system}")

def clean():
    if str(SERVER_DIR) != ".":
        print("Removing " + str(SERVER_DIR.resolve()))
        # shutil.rmtree(SERVER_DIR)
        remove_directory(SERVER_DIR)
    else:
        node_modules = SERVER_DIR / Path("node_modules")
        package_lock = SERVER_DIR / Path("package-lock.json")
        docusaurus = SERVER_DIR / Path(".docusaurus")
        folders = [REPO_DOCS_DIR, DOCS_DIR, BUILD_DIR, docusaurus, node_modules]

        if package_lock.exists():
            print("Removing package-lock.json...")
            package_lock.unlink()

        for folder in folders:
            if folder.exists():
                remove_directory(folder)

def clean_install():
    print("Cleaning install...")

    clean()
    ensure_setup()
    install_dependencies()


def is_node_installed():
    try:
        result = subprocess.run(
            ["node", "--version"],
            check=True,
            capture_output=True,
            text=True,
        )

        print(f"Found Node.js {result.stdout.strip()}")

    except (FileNotFoundError, subprocess.CalledProcessError):
        print("Error: Node.js is not installed or is not working.")
        sys.exit(1)


def menu():
    while True:
        clear()

        print(f"{BOLD}{DARK_GRAY}╔══════════════════════════════╗{RESET}")
        print(f"{BOLD}{DARK_GRAY}║     {YELLOW}Docusaurus Manager       {DARK_GRAY}║{RESET}")
        print(f"{BOLD}{DARK_GRAY}╠══════════════════════════════╣{RESET}")
        print(f"{BOLD}{DARK_GRAY}║ {GREEN}1{RESET}{LIGHT_BLUE}  Run server                {DARK_GRAY}║{RESET}")
        print(f"{BOLD}{DARK_GRAY}║ {GREEN}2{RESET}{LIGHT_BLUE}  Rebuild                   {DARK_GRAY}║{RESET}")
        print(f"{BOLD}{DARK_GRAY}║ {GREEN}3{RESET}{LIGHT_BLUE}  Pull wiki changes         {DARK_GRAY}║{RESET}")
        print(f"{BOLD}{DARK_GRAY}║ {GREEN}4{RESET}{LIGHT_BLUE}  Clean install             {DARK_GRAY}║{RESET}")
        print(f"{BOLD}{DARK_GRAY}║ {GREEN}5{RESET}{LIGHT_BLUE}  Clean                     {DARK_GRAY}║{RESET}")
        print(f"{BOLD}{DARK_GRAY}║ {GREEN}6{RESET}{LIGHT_BLUE}  Write Translations        {DARK_GRAY}║{RESET}")
        print(f"{BOLD}{DARK_GRAY}║ {GREEN}0{RESET}{LIGHT_BLUE}  Exit                      {DARK_GRAY}║{RESET}")
        print(f"{BOLD}{DARK_GRAY}╚══════════════════════════════╝{RESET}")

        print("\nChoose an option: ", end="", flush=True)

        key = msvcrt.getch().decode()

        if key == "1":
            clear()
            print(f"{GREEN}1{RESET}{LIGHT_BLUE}  Run server{RESET}")
            serve_site()
            pause()

        elif key == "2":
            clear()
            print(f"{GREEN}2{RESET}{LIGHT_BLUE}  Rebuild{RESET}")
            print(f"   {DARK_GRAY} Note: GitHub generated files and scripts directly manipulating these files will not be ran.{RESET}")
 
            if not REPO_DOCS_DIR.exists():
                print("Error: " + str(REPO_DOCS_DIR) + " folder not found. You need to pull wiki changes first.")
            else:
                ensure_setup()
                rebuild()

            pause()

        elif key == "3":
            clear()
            print(f"{GREEN}3{RESET}{LIGHT_BLUE}  Pull wiki changes{RESET}")
            ensure_setup()
            clone_or_update_wiki()
            rebuild()
            pause()

        elif key == "4":
            clear()
            print(f"{GREEN}4{RESET}{LIGHT_BLUE}  Clean install{RESET}")
            clean_install()
            clone_or_update_wiki()
            rebuild()
            pause()

        elif key == "5":
            clear()
            print(f"{GREEN}4{RESET}{LIGHT_BLUE}  Clean{RESET}")
            clean_install()
            pause()
        
        elif key == "6":
            clear()
            print(f"{GREEN}6{RESET}{LIGHT_BLUE}  Write Translations{RESET}")
            write_translations()
            pause()

        elif key == "0":
            break


def main():
    is_node_installed()

    if not Path("package.json").exists():
        print("Error: package.json not found.")
        print("Run this script from the root of your Docusaurus project.")
        sys.exit(1)

    os.environ["LOCAL_KINGDOMSX"] = "true"
    menu()


if __name__ == "__main__":
    main()