# Lecture Merger Script

This Python script merges all individual lecture TeX files (Lecture1.tex through Lecture14.tex) into a single unified TeX document.

## Features

- **Automatic path fixing**: Changes all figure paths from `figs/...` to `../lectureN/figs/...` to maintain correct relative paths
- **Preserves lecture structure**: Keeps title pages and outline sections from all lectures to create clear separations
- **Removes recap sections**: Removes "Recap of Previous Lecture" frames to avoid redundancy
- **Disables slide pausing**: Automatically disables `\eqpause` and `\nextonslide` commands to show all content without pauses
- **No CLI arguments**: Simply run the script - everything is hardcoded for your convenience
- **Lecture separators**: Adds clear comment blocks between lectures for easy navigation

## Usage

Simply run the script from the `lectures_merged` folder:

```bash
python3 merge_lectures.py
```

The script will:
1. Read all lecture files from `lecture1/` through `lecture14/`
2. Extract the preamble from Lecture1.tex
3. Merge all content with corrected figure paths
4. Output to `lectures_merged/AllLectures_merged.tex`

## Output

- **File**: `AllLectures_merged.tex` (~7,460 lines)
- **Location**: Same directory as the script (`lectures_merged/`)

## File Structure Expected

```
lectures/
├── lecture1/
│   ├── Lecture1.tex
│   └── figs/
├── lecture2/
│   ├── Lecture2.tex
│   └── figs/
...
├── lecture14/
│   ├── Lecture14.tex
│   └── figs/
└── lectures_merged/
    └── merge_lectures.py  (this script)
```

## Technical Details

- Preserves the LaTeX preamble from Lecture1.tex
- Keeps title pages and outline sections from ALL lectures (creates clear separations between lectures)
- Removes only "Recap of Previous Lecture" frames (keeps other content)
- Each lecture section is marked with an 80-character comment separator
- All `\includegraphics` paths are automatically updated to point to the correct lecture subfolder
- Disables `\eqpause` and `\nextonslide` commands by redefining them:
  - `\eqpause` → empty (does nothing)
  - `\nextonslide{content}` → just shows the content immediately

