const jwtInput = document.getElementById("jwtInput");
const jwtHeader = document.getElementById("jwtHeader");
const jwtPayload = document.getElementById("jwtPayload");
const decodeJwt = document.getElementById("decodeJWT");
const clearJwt = document.getElementById("clearJwt");
const jwtStatus = document.getElementById("jwtStatus");

function decodeBase64Url(value) {
    let base64 = value
        .replace(/-/g, "+")
        .replace(/_/g, "/");

    while (base64.length % 4 !== 0) {
        base64 += "=";
    }

    const bytes = Uint8Array.from(atob(base64), (character) =>
        character.charCodeAt(0)
    );

    return new TextDecoder().decode(bytes);
}

decodeJwt.addEventListener("click" , () =>  {
    const token = jwtInput.value.trim();

    if (token === "") {
        jwtStatus.textContent = "Enter Jwt Token";

        return;

    }

    try {
        const parts = token.split(".");

        if (parts.length !== 3) {
            throw new Error(
                "invalid "
            );
        }

        const header = JSON.parse(decodeBase64Url(parts[0]));
        const payload = JSON.parse(decodeBase64Url(parts[1]));

        jwtHeader.value = JSON.stringify(header, null, 2);
        jwtPayload.value = JSON.stringify(payload, null, 2);
        jwtStatus.textContent = "JWT decoded successfully.";

    }

    catch(error) {
        jwtHeader.value = "";
        jwtPayload.value = "";
        jwtStatus.textContent = "Invalid JWT token";

    }

});

clearJwt.addEventListener("click", () => {

    jwtInput.value = "";
    jwtHeader.value = "";
    jwtPayload.value = "";

    jwtStatus.textContent = "Ready";

});
