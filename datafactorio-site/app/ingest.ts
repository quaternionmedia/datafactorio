import m from "mithril";
import { toGraph } from "./toGraph";
import { renderGraph } from "./cyto";
import { style } from "./style";

// Handle file input change
function handleFileChange(event: Event, cell: any) {
  const fileInput = event.target as HTMLInputElement;
  if (fileInput.files && fileInput.files.length > 0) {
    const fileReader = new FileReader();
    fileReader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target === null) return;
      const elements = JSON.parse(e.target.result as string);
      const graphData = toGraph(elements);
      cell.update({ graphData, style });
      renderGraph(cell);
    };
    for (let i = 0; i < fileInput.files.length; i++) {
      fileReader.readAsText(fileInput.files[i]);
    }
  }
}

export const FileInput = (cell) =>
  m("input.menuitem", {
    type: "file",
    onchange: (e) => {
      handleFileChange(e, cell);
    },
  });
