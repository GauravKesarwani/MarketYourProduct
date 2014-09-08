$(document).ready(function() {
    bby.requires('bby.ui.lightbox', function() {
        bby.ui.lightbox.create({ id: 'mapLightbox', title: nex.mapLightBox.title, css: { width: '600px' } },
                nex.mapLightBox.content);
    });

    $('.minAdvertisedPrice').click(function() {
        $('#bbyuilb-main .map_content').replaceWith(nex.mapLightBox.content);
        $('#bbyuilb-main').load(this.getAttribute('mapurl'));
        bby.ui.lightbox.show();
    });
});
