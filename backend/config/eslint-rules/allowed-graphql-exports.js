/** @type {import("eslint").Rule.RuleModule} */
export const allowedGraphqlExportsRule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'In *.graphql.ts files only `typeDef` and `resolvers` may be exported',
    },
    schema: [],
    messages: {
      invalid: "'{{name}}' export is not allowed here. Valid exports are: {{valid}}",
      noDefault: 'Default exports are not allowed here. Valid exports are: {{valid}}',
      noExportAll: '`export *` is not allowed here. Valid exports are: {{valid}}',
    },
  },

  create(context) {
    const f = context.getFilename();
    if (!f.endsWith('graphql.ts')) return {};

    const allowed = new Set(['typeDef', 'resolvers']);
    const check = (id) => {
      if (!allowed.has(id.name))
        context.report({
          node: id,
          messageId: 'invalid',
          data: { name: id.name, valid: Array.from(allowed).join(', ') },
        });
    };

    return {
      ExportNamedDeclaration(node) {
        if (node.declaration) {
          if (node.declaration.type === 'VariableDeclaration') {
            for (const d of node.declaration.declarations)
              if (d.id.type === 'Identifier') check(d.id);
          } else if (node.declaration.id) {
            check(node.declaration.id);
          }
        }
        for (const s of node.specifiers) check(s.exported);
      },
      ExportDefaultDeclaration(node) {
        context.report({ node, messageId: 'noDefault' });
      },
      ExportAllDeclaration(node) {
        context.report({ node, messageId: 'noExportAll' });
      },
    };
  },
};
