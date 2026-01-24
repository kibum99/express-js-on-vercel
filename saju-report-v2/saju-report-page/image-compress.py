import os
from PIL import Image
from pathlib import Path

def compress_png_images(input_dir, output_dir=None):
    """
    지정된 디렉토리의 모든 PNG 이미지를 0.5배로 축소하고 압축합니다.
    
    Args:
        input_dir: 입력 디렉토리 경로
        output_dir: 출력 디렉토리 경로 (None이면 원본 파일을 덮어씀)
    """
    input_path = Path(input_dir)
    
    # 모든 PNG 파일 찾기 (재귀적으로)
    png_files = list(input_path.rglob("*.png"))
    
    if not png_files:
        print(f"PNG 파일을 찾을 수 없습니다: {input_dir}")
        return
    
    print(f"총 {len(png_files)}개의 PNG 파일을 찾았습니다.")
    
    for png_file in png_files:
        try:
            # 이미지 열기
            img = Image.open(png_file)
            
            # 원본 크기
            original_size = img.size
            print(f"\n처리 중: {png_file}")
            print(f"  원본 크기: {original_size[0]}x{original_size[1]}")
            
            # 0.5배로 축소 (비율 유지)
            new_size = (int(original_size[0] * 0.5), int(original_size[1] * 0.5))
            resized_img = img.resize(new_size, Image.Resampling.LANCZOS)
            
            print(f"  축소 크기: {new_size[0]}x{new_size[1]}")
            
            # 출력 경로 결정
            if output_dir:
                output_path = Path(output_dir) / png_file.relative_to(input_path)
                output_path.parent.mkdir(parents=True, exist_ok=True)
            else:
                output_path = png_file
            
            # PNG로 저장 (압축 옵션 적용)
            # optimize=True: 파일 크기 최적화
            # compress_level=9: 최대 압축 (0-9, 9가 최대)
            resized_img.save(
                output_path,
                "PNG",
                optimize=True,
                compress_level=9
            )
            
            # 파일 크기 비교
            original_file_size = os.path.getsize(png_file)
            compressed_file_size = os.path.getsize(output_path)
            reduction = (1 - compressed_file_size / original_file_size) * 100
            
            print(f"  원본 파일 크기: {original_file_size / 1024:.2f} KB")
            print(f"  압축 파일 크기: {compressed_file_size / 1024:.2f} KB")
            print(f"  크기 감소: {reduction:.1f}%")
            
        except Exception as e:
            print(f"오류 발생 ({png_file}): {e}")
    
    print(f"\n처리 완료! 총 {len(png_files)}개 파일 처리됨.")

if __name__ == "__main__":
    # public/assets/img 디렉토리 경로
    img_dir = "public/assets/img"
    
    # 원본 파일을 덮어쓰기 (백업이 필요하면 output_dir 지정)
    compress_png_images(img_dir)
    
    # 백업이 필요한 경우 아래 주석을 해제하고 사용하세요:
    # compress_png_images(img_dir, output_dir="public/assets/img_compressed")
