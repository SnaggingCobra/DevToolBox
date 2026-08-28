const flexboxPreview = 
    document.getElementById("flexboxPreview");

const flexDirection =
    document.getElementById("flexDirection");

const justifyContent =
    document.getElementById("justifyContent");

const alignItems =
    document.getElementById("alignItems");

const flexWrap =
    document.getElementById("flexWrap");

const flexGap = 
    document.getElementById("flexGap");

const flexColumnGap =
    document.getElementById("flexColumnGap");

const flexGapValue =
    document.getElementById("flexGapValue");

const flexColumnGapValue =
    document.getElementById("flexColumnGapValue");

const flexboxCSS =
    document.getElementById("flexboxCSS");

const flexboxStatus =
    document.getElementById("flexboxStatus");

const resetFlexbox =
    document.getElementById("resetFlexbox");

const copyFlexboxCSS =
    document.getElementById("copyFlexboxCSS");



    function updateFlexbox() {
        const direction =
            flexDirection.value;

        const justify =
            justifyContent.value;

        const align =
            alignItems.value;

        const wrap =
            flexWrap.value;

        const gap =
            Number(flexGap.value);

        const columnGap =
            Number(flexColumnGap.value);

        flexboxPreview.style.flexDirection =
            direction;

        flexboxPreview.style.justifyContent =
            justify;

        flexboxPreview.style.alignItems =
            align;

        flexboxPreview.style.flexWrap =
            wrap;

        flexboxPreview.style.gap =
            `${gap}px`;

        flexboxPreview.style.columnGap =
            `${columnGap}px`;

        flexGapValue.textContent =
            `${gap}px`;

        flexColumnGapValue.textContent =
            `${columnGap}px`;

        const css =
`.container {
    display: flex;
    flex-direction: ${direction};
    justify-content: ${justify};
    align-items: ${align};
    flex-wrap: ${wrap};
    gap: ${gap}px;
    column-gap: ${columnGap}px;
}`;

        flexboxCSS.textContent =
            css;

        flexboxStatus.textContent =
            "✓ Flexbox updated.";
    }

flexDirection.addEventListener(
    "change",
    updateFlexbox
);

justifyContent.addEventListener(
    "change",
    updateFlexbox
);

alignItems.addEventListener(
    "change",
    updateFlexbox
);

flexWrap.addEventListener(
    "change",
    updateFlexbox
);

flexGap.addEventListener(
    "input",
    updateFlexbox
);

flexColumnGap.addEventListener(
    "input",
    updateFlexbox
);


copyFlexboxCSS.addEventListener(
    "click",
    async () => {

        try {

            await navigator.clipboard.writeText(
                flexboxCSS.textContent
            );

            flexboxStatus.textContent =
                "✓ CSS copied to clipboard.";

        } catch (error) {

            flexboxStatus.textContent =
                "✕ Could not copy CSS.";

        }

    }
);


resetFlexbox.addEventListener(
    "click",
    () => {

        flexDirection.value =
            "row";

        justifyContent.value =
            "flex-start";

        alignItems.value =
            "stretch";

        flexWrap.value =
            "nowrap";

        flexGap.value =
            10;

        flexColumnGap.value =
            10;

        updateFlexbox();

        flexboxStatus.textContent =
            "✓ Flexbox reset.";

    }
);

updateFlexbox();
    