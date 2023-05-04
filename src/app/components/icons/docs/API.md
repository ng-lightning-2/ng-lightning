### <ngl-icon>
#### NglIcon

| Property | Description | Type | Default |
| -------- | ----------- | ---- | ------- |
| `[iconName]` | LDS name of the icon in `utility:info` format. | string | |
| `[variant]` | Appearance of the icon. |  'default' \| 'warning' \| 'error' \| 'light' \| 'inverse' \| null | 'default' |
| `[size]` | Size of the icon. | 'xx-small' \| 'x-small' \| 'small' \| 'large' | |
| `[alternativeText]` | Text to describe what happens when clicked, not what the icon looks like. | string | |
| `[svgClass]` | Extra class(es) you want to apply to SVG element. | ngClass | |


### <svg nglIconName>
#### NglIconSvg

| Property | Description | Type | Default |
| -------- | ----------- | ---- | ------- |
| `[iconName]` | LDS name of the icon in `utility:info` format. | string | |


### NGL_ICON_CONFIG<NglIconConfig>

Injection token that can be used to specify default icon options.


*Available properties*
  *  `svgPath` = `assets/icons`: path to LDS icons