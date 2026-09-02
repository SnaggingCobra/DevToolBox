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

const itemCount = document.getElementById("itemCount");

const generateItems = 
    document.getElementById("generateItems");



function updateItems() {
    let count = Number(itemCount.value);

    if (!count || count <1) {
        count = 1;
    }

    if (count > 20) {
        count = 20;
    }
    
    itemCount.value = count;


    flexboxPreview.innerHTML = "";
    
    for (let i = 0; i < count; i++) {
        const item = document.createElement("div");
        item.className = "flex-item";
        item.textContent = i+1;
        flexboxPreview.appendChild(item);
    }

}


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

    generateItems.addEventListener("click", () => {
        updateItems();
        updateFlexbox();

        flexboxStatus.textContent =
            "Items generated.";
    }
);

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
        
        itemCount.value =4;


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

        updateItems();
        updateFlexbox();

        flexboxStatus.textContent = " Flexbox reset.";

    }
);


updateItems();
updateFlexbox();
    