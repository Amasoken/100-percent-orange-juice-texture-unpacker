## Motivation

Extracting textures pipeline now all in one place. No more:

-   Scrolling through thousands of textures;
-   Extracting selected files for a character;
-   Renaming extracted files;
-   Converting .dat to .png;
-   Moving files to appropriate folders;

All that now can be done for you by this app.

## App Capabilities

-   Export 100% Orange Juice textures for modding;
-   Rename all the .dat textures to .dds or (optional) convert to .png files
-   Export a list of files in texture archives;

## Prerequisites

-   Node 10.24.1 or higher
-   (Optional) [DDStronk.exe](https://github.com/scorpdx/ddstronk/releases) for converting **.dat** (**.dds**) files into **.png**
-   Ability to write a character name or to create a regexp for extracting specific files would be quite helpful

## Installation

Download project or clone the project.

To install dependencies run

`yarn --prod`

This will skip dev dependencies such as lint and prettier. If you need all dependencies run `yarn` instead

**If you need to convert texture files to png format** download [DDStronk.exe](https://github.com/scorpdx/ddstronk/releases) and put it in the root of project folder.

## Configuration

This app requires `config.ini` file with settings. Just copy `config.example.ini` file and rename it into `config.ini`.

Alternatively you can run `yarn configure` to copy and validate the config.

Config parameters are just plain text strings under `[parameter names]`, so replace them with your values. No quotes required. Lines starting with `#` or `;` are treated as comments.

All parameters are described in `config.example.ini`.

| Param Name       | Expected value    | Description                                                                                                                                                                                                                    |
| ---------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| GameDirectory    | string            | Path to the game directory. Must contain `data` folder with .pak archives                                                                                                                                                      |
| OutputDirectory  | string            | Exports will be created here. Leave as `./` to export into the project directory                                                                                                                                               |
| ConvertToPNG     | `true` or `false` | Convert images to `png` using [DDStronk.exe](https://github.com/scorpdx/ddstronk/releases). Requires DDStronk.exe to be present at the project root directory.                                                                 |
| RenameToDDS      | `true` or `false` | Change file extension to `dds` or leave it as `dat`                                                                                                                                                                            |
| ExportArchives   | string            | A list of archives for export, each archive on a separate line. Commented out archives are ignored. See config example for details                                                                                             |
| SearchExpression | string or regexp  | String or regex for search. Write a character name as specified in the archives. Something like `starb` for a simple match, or `starb\|reika`, `/starb\|reika/`, `/Starb\|Reika/i` or just an empty string to match all files. |

After you have configured your `config.ini` you can validate the configuration with `yarn configure`. If there are no errors, you can export your textures and texture names.

## Exporting textures

To export textures for the selected archives run

`yarn start`

or

`yarn export:textures`

This will create a folder with a name similar to `EXPORT_2023.11.02_13.14.15.123`, except the current date will be reflected. Export folder will be created in the output directory with your exports, stored in associated folders (alphamasks, hairs, and so on).

## Exporting texture names

If you need a list of textures in the archives (to create RegExp or something), run

`yarn export:names`

This will create `TEXTURE_LIST.txt` file in the project root with texture names for the selected archives. All numbers are replaced with `#` for convenience, so you'll get a list like this:

```
...
poppo_##_##.dat
qpd_##_##.dat
qp_##_##.dat
reika_##_##.dat
...
```

If you need full texture names with numbers unreplaced, comment out `currentName = currentName.replace(/\d/g, '#');` in `/src/exportTextureNames.js`

## Useful Links

-   [100% Orange Juice](https://store.steampowered.com/app/282800/100_Orange_Juice/) game on Steam

-   Game [Modding Documentation](https://steamcommunity.com/sharedfiles/filedetails/?id=2189405817)

-   DDS-to-PNG converter [DDStronk](https://github.com/scorpdx/ddstronk) that works with OJ textures. Drop files/folders onto the exe or use command line for conversion.

## License

MIT
