# datafactorio
Factorio mod for exporting data

## setup
In `runme.ipynb`, run `package_app` function, passing in the appropriate mod folder.

This will zip the contents of the mod/src directory and place it in the mod folder.

Check the mod section in factorio menu to verify.


## usage
`ctrl+shift+U` to open the menu
`ctrl+shift+J` to export data

Button above inventory (press `e` in game) that mirrors menu button

## output
Files output to the `script-output` folder of factorio. Three datafiles are output with a seemingly random number followed by the type of data. These are json files of graphs (nodes and edges).

