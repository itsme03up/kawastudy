# パララックス背景画像の格納構成

## 推奨ディレクトリ構造
```
static/img/parallax/
├── backgrounds/
│   ├── nature_left.png      # 左側の自然背景（岩・草）
│   ├── nature_right.png     # 右側の自然背景（岩・草）
│   ├── path_texture.png     # 中央の道のテクスチャ
│   └── overlays/
│       ├── fog.png          # 霧エフェクト用
│       └── particles.png    # パーティクル用
├── tiles/
│   ├── rock_tile.png        # 岩のタイル画像
│   ├── grass_tile.png       # 草のタイル画像
│   ├── gravel_tile.png      # 砂利のタイル画像
│   └── mud_tile.png         # 泥のタイル画像
├── characters/
│   ├── kawada_topdown.svg   # 上から見た川田先生
│   └── kawada_walking.gif   # 歩行アニメーション
└── effects/
    ├── rain.png             # 雨エフェクト
    ├── light_rays.png       # 光の演出
    └── shadows.png          # 影エフェクト
```

## 画像仕様の推奨事項

### 背景画像
- **サイズ**: 1920x1080px以上（高解像度対応）
- **形式**: PNG（透明度が必要な場合）またはJPG
- **最適化**: 圧縮済み（ファイルサイズ < 500KB）

### タイル画像
- **サイズ**: 64x64px または 128x128px（繰り返し表示用）
- **形式**: PNG
- **シームレス**: 継ぎ目のないタイル設計

### キャラクター画像
- **川田アバター**: 80x80px（現在の仕様に合わせて）
- **形式**: PNG（透明背景）
```
