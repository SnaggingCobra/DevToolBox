const base64Input =
    document.getElementById("base64Input");

const base64Output =
    document.getElementById("base64Output");

const encodeBase64 =
    document.getElementById("encodeBase64");

const decodeBase64 =
    document.getElementById("decodeBase64");

const clearBase64 =
    document.getElementById("clearBase64");

const copyBase64 =
    document.getElementById("copyBase64");

const base64Status = 
    document.getElementById("base64Status");

    

encodeBase64.addEventListener("click", () => {
    const input = base64Input.value;

    if (input === "") {
        base64Status.textContent = "Please Enter Some Text";
        return;
    }

    try {
        const encoded =
            btoa(
                unescape(
                    encodeURIComponent(input)
                )
            );
            base64Output.value = 
                encoded;

                base64Status.textContent = 
                    "text Encoded";

    }
    catch (error) {
        base64Status.textContent =
            "coudnt encode the Text";

    }

    });

decodeBase64.addEventListener("click", () => {

    const input =
        base64Input.value.trim();

    if (input === "") {
        base64Status.textContent = 
        "Please Enter Base64 Text";
    return;
    }

    try {
        const decoded =
            decodeURIComponent(
                escape(
                    atob(input)
                )
            );
            base64Output.value = decoded;
            base64Status.textContent = "Base64 decoded";
    }

    catch (error){

        base64Output.value = "";
        base64Status.textContent = "Invalid Base64 Input";
    }
    });


    copyBase64.addEventListener("click", async () => {
        if (base64Output.value === "") {
            base64Status.textContent =
                "Nothing to copy";

        return;
        }

        try {
            await navigator.clipboard.writeText(
                base64Output.value
            );

            base64Status.textContent =
                "output copied";
        }
        catch (error) {
            base64Status.textContent =
                "coudnt copy Output";
        }
    });