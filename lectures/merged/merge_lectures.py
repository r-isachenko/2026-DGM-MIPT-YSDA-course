import os
import re

def extract_lecture_content(lecture_num, lectures_dir):
    """
    Extract content from a single lecture file.
    
    Args:
        lecture_num: The lecture number (1-14)
        lectures_dir: Base directory containing all lecture folders
    
    Returns:
        Processed content string with fixed paths
    """
    lecture_folder = os.path.join(lectures_dir, f'lecture{lecture_num}')
    tex_file = os.path.join(lecture_folder, f'Lecture{lecture_num}.tex')
    
    if not os.path.exists(tex_file):
        print(f"Warning: {tex_file} not found, skipping...")
        return ""
    
    with open(tex_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract content between \begin{document} and \end{document}
    doc_pattern = r'\\begin\{document\}(.*?)\\end\{document\}'
    match = re.search(doc_pattern, content, re.DOTALL)
    
    if not match:
        print(f"Warning: Could not find document environment in {tex_file}")
        return ""
    
    lecture_content = match.group(1)
    
    # Remove "Recap of Previous Lecture" frames (keep title pages and outlines)
    lecture_content = re.sub(
        r'%[=-]+\s*\\begin\{frame\}\{Recap of Previous Lecture\}.*?\\end\{frame\}',
        '',
        lecture_content,
        flags=re.DOTALL
    )
    
    # Fix figure paths: figs/ -> ../lectureN/figs/
    lecture_content = lecture_content.replace(
        '{figs/',
        f'{{../lecture{lecture_num}/figs/'
    )
    
    # Replace \tableofcontents with \tableofcontents[part=N] to show only this lecture's sections
    lecture_content = lecture_content.replace(
        r'\tableofcontents',
        f'\\tableofcontents[part={lecture_num}]'
    )
    
    # Add a lecture separator comment, part command, and update the title for this lecture
    lecture_header = f"\n%{'='*80}\n% LECTURE {lecture_num}\n%{'='*80}\n"
    lecture_header += f"\\part{{Lecture {lecture_num}}}\n"
    lecture_header += f"\\createdgmtitle{{{lecture_num}}}\n"
    
    return lecture_header + lecture_content


def merge_all_lectures(num_lectures=14):
    """
    Merge all lecture files into a single tex file.
    
    Args:
        num_lectures: Total number of lectures to merge (default: 14)
    """
    # Get the directory structure
    script_dir = os.path.dirname(os.path.abspath(__file__))
    lectures_dir = os.path.dirname(script_dir)
    output_file = os.path.join(script_dir, 'merged.tex')
    
    print(f"Lectures directory: {lectures_dir}")
    print(f"Output file: {output_file}")
    
    # Read the first lecture to get the preamble
    lecture1_file = os.path.join(lectures_dir, 'lecture1', 'Lecture1.tex')
    
    with open(lecture1_file, 'r', encoding='utf-8') as f:
        lecture1_content = f.read()
    
    # Extract preamble (everything before \begin{document})
    preamble_match = re.search(r'^(.*?)\\begin\{document\}', lecture1_content, re.DOTALL)
    
    if not preamble_match:
        print("Error: Could not extract preamble from Lecture1.tex")
        return
    
    preamble = preamble_match.group(1)
    
    # Start building the merged document
    merged_content = preamble
    
    # Add TikZ packages needed for diagrams
    merged_content += "\n\\usepackage{tikz}\n"
    merged_content += "\\usetikzlibrary{arrows.meta,positioning,fit}\n"
    merged_content += "\n"
    
    # Add commands to disable slide pausing (eqpause and nextonslide)
    merged_content += "% Disable slide pausing commands for merged document\n"
    merged_content += "\\renewcommand{\\eqpause}{}\n"
    merged_content += "\\renewcommand{\\nextonslide}[1]{#1}\n"
    merged_content += "\n"
    
    merged_content += "\\begin{document}\n"
    merged_content += "%--------------------------------------------------------------------------------\n"
    
    # Merge all lectures (each will have its own title page and outline)
    print(f"\nMerging lectures 1 to {num_lectures}...")
    
    for i in range(1, num_lectures + 1):
        print(f"Processing Lecture {i}...")
        lecture_content = extract_lecture_content(i, lectures_dir)
        merged_content += lecture_content
    
    # Add document end
    merged_content += "\n\\end{document}\n"
    
    # Write the merged file
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(merged_content)
    
    print(f"\n✓ Successfully merged {num_lectures} lectures into: {output_file}")
    print(f"  Total size: {len(merged_content)} characters")


if __name__ == "__main__":
    merge_all_lectures(num_lectures=14)
