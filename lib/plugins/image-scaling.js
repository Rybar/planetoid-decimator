ig.module('plugins.image-scaling').requires('impact.image')
.defines(function() {
    ig.Image.inject({
        disableScaling: false,
        resize: function( scale ) {
            // Nearest-Neighbor scaling
            
            // The original image is drawn into an offscreen canvas of the same size
            // and copied into another offscreen canvas with the new size. 
            // The scaled offscreen canvas becomes the image (data) of this object.
            
            var widthScaled = this.width * scale;
            var heightScaled = this.height * scale;
            var pixels = null;

            var orig = ig.$new('canvas');
            orig.width = this.width;
            orig.height = this.height;
            var origCtx = orig.getContext('2d');
            origCtx.drawImage( this.data, 0, 0, this.width, this.height, 0, 0, this.width, this.height );
            var origPixels = origCtx.getImageData(0, 0, this.width, this.height);

            var scaled = ig.$new('canvas');
            scaled.width = widthScaled;
            scaled.height = heightScaled;
            var scaledCtx = scaled.getContext('2d');
            var scaledPixels = scaledCtx.getImageData( 0, 0, widthScaled, heightScaled );

            if (this.disableScaling) {
                pixels = origPixels;
            } else {
                for( var y = 0; y < heightScaled; y++ ) {
                    for( var x = 0; x < widthScaled; x++ ) {
                        var index = (Math.floor(y / scale) * this.width + Math.floor(x / scale)) * 4;
                        var indexScaled = (y * widthScaled + x) * 4;
                        scaledPixels.data[ indexScaled ] = origPixels.data[ index ];
                        scaledPixels.data[ indexScaled+1 ] = origPixels.data[ index+1 ];
                        scaledPixels.data[ indexScaled+2 ] = origPixels.data[ index+2 ];
                        scaledPixels.data[ indexScaled+3 ] = origPixels.data[ index+3 ];
                    }
                }

                pixels = scaledPixels;
            }

            scaledCtx.putImageData( pixels, 0, 0 );

            this.data = scaled;
        }
    });
});