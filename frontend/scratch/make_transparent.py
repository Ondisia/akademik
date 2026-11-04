from PIL import Image, ImageDraw
import sys

def remove_background(input_path, output_path, tolerance=30):
    img = Image.open(input_path).convert("RGBA")
    
    width, height = img.size
    pixels = img.load()
    
    # BFS queue starting from the 4 corners
    q = [(0, 0), (width-1, 0), (0, height-1), (width-1, height-1)]
    visited = set(q)
    
    # Assume the top-left pixel is a good representative of the background color
    bg_r, bg_g, bg_b, _ = pixels[0, 0]
    
    while q:
        x, y = q.pop(0)
        
        r, g, b, a = pixels[x, y]
        # Check if color is within tolerance of background color
        if abs(r - bg_r) < tolerance and abs(g - bg_g) < tolerance and abs(b - bg_b) < tolerance:
            # Make transparent
            pixels[x, y] = (255, 255, 255, 0)
            
            # Add neighbors
            for dx, dy in [(1, 0), (-1, 0), (0, 1), (0, -1)]:
                nx, ny = x + dx, y + dy
                if 0 <= nx < width and 0 <= ny < height and (nx, ny) not in visited:
                    visited.add((nx, ny))
                    q.append((nx, ny))

    img.save(output_path)

if __name__ == '__main__':
    remove_background('d:/Sistem Akademik SMK/src/assets/logo-nj.jpg', 'd:/Sistem Akademik SMK/src/assets/logo-nj.png', 50)
    print("Saved logo-nj.png")
