import React, { useState, useEffect, useRef } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
} from "@codesandbox/sandpack-react";

const Sandbox = ({ appCode, cssCode }: any) => {
  const [key, setKey] = useState(0);
  const previousAppCodeRef = useRef(null);
  const previousCssCodeRef = useRef(null);

  const defaultAppCode = `export default function App() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-12 border border-gray-700">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              Welcome to React Playground
            </h1>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </div>
          
          <p className="text-gray-300 text-lg mb-8 leading-relaxed">
            Start building amazing React components with Tailwind CSS. 
            Edit the code on the left and watch your changes come to life instantly!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg">
              Get Started
            </button>
            <button className="px-6 py-3 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors duration-200 border border-gray-600">
              Learn More
            </button>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-700">
            <p className="text-gray-400 text-sm">
              🚀 Ready to create something awesome?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}`;

  const defaultCssCode = `@tailwind base;
        @tailwind components;
        @tailwind utilities;

        /* Custom styles can be added here */
        body {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
            'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
            sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }`;

  const finalAppCode = appCode || defaultAppCode;
  const finalCssCode = cssCode || defaultCssCode;


  useEffect(() => {
    const appChanged = appCode && appCode !== previousAppCodeRef.current;
    const cssChanged = cssCode && cssCode !== previousCssCodeRef.current;

    if (appChanged || cssChanged) {
      if (appChanged) previousAppCodeRef.current = appCode;
      if (cssChanged) previousCssCodeRef.current = cssCode;

      setKey((prev) => prev + 1);
    }
  }, [appCode, cssCode]);

  const files = {
    "/App.js": finalAppCode,
    "/styles.css": finalCssCode,
    "/public/index.html": `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>React Playground</title>
            <link href="/styles.css" rel="stylesheet" />
        </head>
        <body>
            <div id="root"></div>
        </body>
        </html>`,
    "/tailwind.config.js": `module.exports = {
        purge: [],
        darkMode: false,
        theme: {
            extend: {},
        },
        variants: {
            extend: {},
        },
        plugins: [],
        }`,
  };

  return (
    <div className="w-full h-screen p-4 bg-[#212121]">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-white">Code Playground</h2>
      </div>

      <SandpackProvider
        key={key}
        template="react"
        files={files}
        theme="dark"
        customSetup={{
          dependencies: {
            react: "^18.0.0",
            "react-dom": "^18.0.0",
            tailwindcss: "^2.2.19",
            postcss: "^8.3.0",
            autoprefixer: "^10.3.1",
          },
        }}
        options={{
          activeFile: "/App.js",
          visibleFiles: ["/App.js", "/styles.css"],
          externalResources: ["https://cdn.tailwindcss.com"],
          // Performance optimizations from fast version
          recompileMode: "immediate",
          recompileDelay: 0,
          autoReload: true,
          bundlerURL: undefined, // Use default bundler for speed
        }}>
        <div className="flex h-[calc(100vh-8rem)] border rounded-md overflow-hidden bg-white">
          {/* Left side - Code Editor */}
          <div className="w-1/2 border-r">
            <SandpackCodeEditor
              showTabs
              showLineNumbers
              showInlineErrors
              wrapContent
              style={{
                height: "100%",
                fontSize: "14px",
              }}
              // Performance optimizations
              extensions={[]}
              readOnly={false}
            />
          </div>

          {/* Right side - Preview */}
          <div className="w-1/2">
            <SandpackPreview
              style={{ height: "100%" }}
              showOpenInCodeSandbox={false}
              showRefreshButton={true}
              showNavigator={false}
              // Performance optimizations
              startRoute="/"
              showRestartButton={false}
            />
          </div>
        </div>
      </SandpackProvider>
    </div>
  );
};

export default Sandbox;
