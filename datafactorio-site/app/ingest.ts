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
  m("input.menuitem.file", {
    type: "file",
    onchange: (e) => {
      handleFileChange(e, cell);
    },
  });

// TODO: trying to set the 'for' attribute of the button to the id of the input
// export const FileInput = (cell) =>
//   m("div#fileinput.menuitem",
//     m("button#custom_fileinput", {for:"input#real_fileinput"}, "Browse..."),
//     m("input#real_fileinput", {
//       type: "file",
//       onchange: (e) => {
//         handleFileChange(e, cell);
//       },
//     })
//   );

// corresponding css 
// .file {
//   width: 100%;
// }
// .file {
//   background-color: #333639;
// }
// input[type="file"] {
//   display: none;
// }