import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children, ...props }) => (
      <h1 {...props} className="text-preset-7 my-6">
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2 {...props} className="text-preset-6 my-6">
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3 {...props} className="text-preset-5 my-6">
        {children}
      </h3>
    ),
    h4: ({ children, ...props }) => (
      <h4 {...props} className="text-preset-4 my-6">
        {children}
      </h4>
    ),
    h5: ({ children, ...props }) => (
      <h5 {...props} className="text-preset-4 my-6">
        {children}
      </h5>
    ),
    h6: ({ children, ...props }) => (
      <h6 {...props} className="text-preset-4 my-6">
        {children}
      </h6>
    ),
    ul: ({ children, ...props }) => (
      <ul {...props} className="ps-10 list-revert">
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol {...props} className="ps-10 list-revert">
        {children}
      </ol>
    ),
    p: ({ children, ...props }) => (
      <p {...props} className="text-preset-3 my-4">
        {children}
      </p>
    ),
    code: ({ children, ...props }) => (
      <code
        {...props}
        className="bg-highlight dark:bg-highlight-dark text-primary rounded p-1"
      >
        {children}
      </code>
    ),
    hr: ({ ...props }) => <hr {...props} className="my-6" />,
    ...components,
  };
}
