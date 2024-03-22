import m from "mithril";
import { toGraph } from "./toGraph";
import { renderGraph } from "./cyto";
import { style } from "./style";
import { defaultGraphOptions } from "./state";

// Handle file input change
function handleFileChange(event: Event, cell: any) {
  const fileInput = event.target as HTMLInputElement;
  // If there are files to process
  if (fileInput.files && fileInput.files.length > 0) {
    const fileReader = new FileReader();
    // Load the file
    fileReader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target === null) return;
      const elements = JSON.parse(e.target.result as string);
      const graphData = toGraph(elements);
      cell.update({ graphData, style }); 
      renderGraph(cell);
    };
    // Read the file as text
    for (let i = 0; i < fileInput.files.length; i++) {
      fileReader.readAsText(fileInput.files[i]);
    }
    cell.update({ graphName: fileInput.files[0].name, graphSelected: defaultGraphOptions[0] });
  }
};

// Browse button and filename display
export const FileInput = (cell) => {
  // Trigger file input click event
  const triggerFileInput = () => document.getElementById("fileInput")?.click(); 
  return m("div.menuitem",
    // Actual file input element
    m("input#fileInput.file", { 
      type: "file",
      onchange: (e) => handleFileChange(e, cell),
      style: { display: "none" }, // Hide the actual file input
    }),
    // Custom input button
    m("button.browse", 
      { onclick: triggerFileInput }, 
      "Browse Files"
    ),
  );
};