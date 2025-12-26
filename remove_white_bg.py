from PIL import Image

def remove_white_background(input_path, output_path):
    img = Image.open(input_path)
    img = img.convert("RGBA")
    datas = img.getdata()

    newData = []
    for item in datas:
        # Change all white (also shades of whites)
        # to transparent
        if item[0] > 200 and item[1] > 200 and item[2] > 200:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)

    img.putdata(newData)
    img.save(output_path, "PNG")
    print("Background removed successfully.")

if __name__ == "__main__":
    input_image = r"C:/Users/PRO/.gemini/antigravity/brain/17f66bed-d23b-4cd7-b723-7db706811625/uploaded_image_1766311504789.png"
    output_image = "n:/sign/src/assets/bubbles.png"
    remove_white_background(input_image, output_image)
