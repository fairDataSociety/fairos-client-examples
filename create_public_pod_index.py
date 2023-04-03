import os
import sys
import argparse

def create_index_html(startpath, title=None, description=None):
    with open("index.html", "w") as f:
        f.write("<html><head><title>{0}</title></head><body>\n".format(title or ""))
        if title:
            f.write("<h1>{0}</h1>".format(title))
        if description:
            f.write("<p>{0}</p>".format(description))
        for root, dirs, files in os.walk(startpath):
            for file in files:
                # Create a relative link to the file
                relpath = os.path.relpath(os.path.join(root, file), startpath)
                link = "<a href='{0}'>{1}</a><br>\n".format(relpath, file)
                f.write(link)
        f.write("</body></html>")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Create an HTML index of files in a directory tree.")
    parser.add_argument("path", help="The path to the directory to index.")
    parser.add_argument("--title", help="The title of the HTML document.")
    parser.add_argument("--description", help="A description of the content of the directory.")
    args = parser.parse_args()
    
    create_index_html(args.path, args.title, args.description)


