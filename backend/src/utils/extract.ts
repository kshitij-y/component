export const extract = (output: string) => {
  const jsxMatch = output.match(/\/\/ App\.jsx\n([\s\S]*?)\/\/ styles\.css/);
  const cssMatch = output.match(/\/\/ styles\.css\n([\s\S]*)/);

  return {
    jsx: jsxMatch?.[1]?.trim() || "",
    css: cssMatch?.[1]?.trim() || "",
  };
};
