window.MathJax = {
  loader: {
    load: ['[tex]/tagformat', '[tex]/color']
  },
  startup: {
    pageReady: () => {
      console.log('Running MathJax');
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
