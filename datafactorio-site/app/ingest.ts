import m from "mithril";
import { toGraph } from "./toGraph";
import { defaultGraphOptions, updateState } from "./state";

// Handle file input change
function handleFileChange(event: Event, cell) {
  // Check if there are files to process
  const fileInput = event.target as HTMLInputElement;
  if (fileInput.files && fileInput.files.length > 0) {
    // Load the file
    const fileReader = new FileReader();
    fileReader.onload = (e: ProgressEvent<FileReader>) => {
      // Update the state with the new graph data
      if (e.target === null) return;
      const elements = JSON.parse(e.target.result as string);
      const graphData = toGraph(elements);
      updateState(cell, { graphData: graphData });
    };

    // Read the file as text
    fileReader.readAsText(fileInput.files[0]);
    const filename = fileInput.files[0].name;
    updateState(cell, {
      graphName: "File: " + filename,
      graphSelected: defaultGraphOptions[0],
    });
  }
}

// Browse button and filename display
export const FileInput = (cell) =>
  m(
    "div.menuitem",
    // Actual file input element
    m("input#fileInput.file", {
      type: "file",
      onchange: (e) => handleFileChange(e, cell),
      style: { display: "none" }, // Hide the actual file input
    }),
    // Custom input button clicks above hidden button
    m(
      "button.menuItem.browse",
      { onclick: () => document.getElementById("fileInput")?.click() },
      "Browse Files"
    )
  );
