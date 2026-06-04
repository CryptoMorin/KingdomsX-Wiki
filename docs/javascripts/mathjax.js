window.MathJax = {
  loader: {
    load: ['[tex]/tagformat', '[tex]/color']
  },
  startup: {
    pageReady: () => {
      alert('Running MathJax');
      return MathJax.startup.defaultPageReady();
    }
  },
  tex: {
    packages: {'[+]': ['color'], '[+]': ['tagformat']},
    tagSide: 'left',
    macros: {
      RR: '{\\bf R}',
      bold: ['{\\bf #1}', 1]
    },
    tagformat: {
       tag: (n) => '[' + n + ']'
    }
  }
};
