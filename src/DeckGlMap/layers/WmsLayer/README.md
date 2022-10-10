# DeckGlMap: WmsLayer
## props
### options (Object)
#### url (string)
#### params (Object)
#### pickable (bool)
The "picking engine" identifies which object in which layer is at the given coordinates. While usually intuitive, what constitutes a pickable "object" is defined by each layer. 

It must be set to true if tooltip should be displyed.
#### hoverable (bool)
It must be set to true if tooltip should be displyed.
#### transparentColor (Array)
https://deck.gl/docs/api-reference/layers/bitmap-layer#transparentcolor[https://deck.gl/docs/api-reference/layers/bitmap-layer#transparentcolor]
The color to use for transparent pixels, in [r, g, b, a]. Each component is in the [0, 255] range.

Default value:
``
[0, 0, 0, 0]
``
#### textureParameters (Object)
Default value:
```
{
    [GL.TEXTURE_MIN_FILTER]: GL.LINEAR_MIPMAP_LINEAR,
    [GL.TEXTURE_MAG_FILTER]: GL.LINEAR,
    [GL.TEXTURE_WRAP_S]: GL.CLAMP_TO_EDGE,
    [GL.TEXTURE_WRAP_T]: GL.CLAMP_TO_EDGE,
}
```
### opacity (number)