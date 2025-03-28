"use strict";

import { authentication } from "../../public/assets/scripts/authentication";

const mockErrorMessages = [
    { i18n: "error.email_invalid" },
    { i18n: "error.password_length" },
    { i18n: "error.password_uppercase" },
    { i18n: "error.password_lowercase" },
    { i18n: "error.password_digit" },
    { i18n: "error.password_special" },
    { i18n: "error.no_account_found" },
];

test("authentication_MissingValue_ThrowsErrorEmailOrPasswordMissing", async () => {
    // given
    const email = "user@example.com";
    const password = "ValidPass123!";

    // when
    const firstAuthenticate = await authentication("", password);
    const secondAuthenticate = await authentication(email, "");

    // then
    expect(firstAuthenticate).toEqual(
        expect.arrayContaining([mockErrorMessages[0]])
    );
    expect(secondAuthenticate).toEqual(
        expect.arrayContaining([
            mockErrorMessages[1],
            mockErrorMessages[2],
            mockErrorMessages[3],
            mockErrorMessages[4],
            mockErrorMessages[5],
        ])
    );
});

test("authentication_InvalidMailFormat_ThrowsErrorEmailIsInvalid", async () => {
    // given
    const validPassword = "ValidPass123!";

    // when
    const firstAuthenticate = authentication("invalid-email", validPassword);
    const secondAuthenticate = authentication("user@.com", validPassword);

    // then
    expect(firstAuthenticate).toEqual(
        expect.arrayContaining([mockErrorMessages[0]])
    );
    expect(secondAuthenticate).toEqual(
        expect.arrayContaining([mockErrorMessages[0]])
    );
});

test("authentication_InvalidPasswordFormat_ThrowsErrorPasswordDoesNotMeetRequirements", async () => {
    // given
    const email = "user@example.com";

    // when
    const firstAuthenticate = authentication(email, "short");
    const secondAuthenticate = authentication(email, "NoSpecialChar123");

    // then
    expect(firstAuthenticate).toEqual(
        expect.arrayContaining([mockErrorMessages[1]])
    );
    expect(secondAuthenticate).toEqual(
        expect.arrayContaining([mockErrorMessages[5]])
    );
});

test("authentication_NominalCase_UserIsAuthenticated", async () => {
    // given
    const email = "user@example.com";
    const password = "ValidPass123!";

    // when
    const result = await authentication(email, password);

    // then
    expect(result).toEqual([]);
});

test("authentication_IncorrectLogin_AuthenticationFails", async () => {
    // given
    const email = "user@example.com";
    const password = "InvalidPass123!";

    // when
    const result = await authentication(email, password);

    // then
    expect(result).toEqual(expect.arrayContaining([mockErrorMessages[6]]));
});
