function fixLetterSpacingPlugin({ types: t }) {
  return {
    name: 'fix-letter-spacing',
    visitor: {
      ObjectProperty(path) {
        const key = path.node.key;
        const keyName = key.name || key.value;
        if (keyName === 'letterSpacing') {
          const val = path.node.value;
          if (t.isStringLiteral(val)) {
            const raw = val.value.trim();
            let parsed = parseFloat(raw);
            if (raw.endsWith('em') && Math.abs(parsed) < 1) {
              parsed = Math.round(parsed * 10 * 10) / 10;
            }
            if (!isNaN(parsed)) {
              path.node.value = t.numericLiteral(parsed);
            }
          } else if (t.isTemplateLiteral(val) && val.quasis.length === 1) {
            const raw = val.quasis[0].value.raw.trim();
            const parsed = parseFloat(raw);
            if (!isNaN(parsed)) {
              path.node.value = t.numericLiteral(parsed);
            }
          }
        }
      }
    }
  };
}

module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['nativewind/babel', fixLetterSpacingPlugin],
  };
};
