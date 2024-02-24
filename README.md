# datafactorio
Factorio mod to export data

## Setup
To set up the `datafactorio` mod, follow these steps:

1. In `runme/setup.ipynb`, run the `package_app` function (set the path to the appropriate mod folder).
1. This process will zip the contents of the `mod/src` directory and place the zipped file in the mod folder.
1. Verify the installation by checking the mod section in the Factorio game menu.

## Usage:

- `ctrl+shift+U` to open the export menu. Checkboxes toggle export types
- `ctrl+shift+J` to export the selected data. Export mirror checkboxes

## Output
Exported files are output to the `script-output` folder within your Factorio directory. The filenames are generated with a seemingly random number followed by the type of data they contain, e.g., `123456-inventory.json` for inventory data. These files are in JSON format, detailing the selected data graphs (nodes and edges) based on the user's choices in the export menu.

## Site
To run the frontend for `datafactorio`, navigate to the `datafactorio-site` directory and execute the following commands:

1. `npm install` to install the necessary dependencies.
1. `npm run dev` to start the development server.
1. `localhost:1234` (or similar) will serve the site
1. Select the file from the local factorio `script-output`
