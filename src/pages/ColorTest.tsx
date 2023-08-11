import React, { useState } from 'react';
import { ColorExtractor } from 'react-color-extractor';

const ColorTest: React.FC = () => {
  const [mainColors, setMainColors] = useState<string[]>([]);

  const handleColorsExtracted = (colors: string[]) => {
    // 이미지에서 추출된 모든 색상을 가장 많이 나타나는 순서대로 정렬합니다.
    const sortedColors = colors.sort((a, b) =>
      colors.filter((color) => color === a).length >
      colors.filter((color) => color === b).length
        ? -1
        : 1
    );

    // 가장 많이 나타나는 주요 색상 2개를 선택합니다.
    const mainColors = sortedColors.slice(0, 2);
    setMainColors(mainColors);
  };

  return (
    <div>
      <ColorExtractor getColors={handleColorsExtracted}>
        <img
          src={"https://i.scdn.co/image/ab67616d0000b27357de3da10da259d0a19a81b4"} // 이미지 URL을 여기에 넣어주세요.
          alt="Color Extractor"
        />
      </ColorExtractor>
      <div>
        <h3>Main Colors:</h3>
        <div style={{ display: 'flex' }}>
          {mainColors.map((color, index) => (
            <div
              key={index}
              style={{
                backgroundColor: color,
                width: 50,
                height: 50,
                marginRight: 10,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColorTest;
