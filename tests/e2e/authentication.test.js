"use strict";

const { authenticate } = require("../../public/assets/scripts/authentication");

test("authentication_MissingValue_ThrowsErrorEmailOrPasswordMissing", async () => {
    // given
    const email = "user@example.com";
    const password = "ValidPass123!";

    // when
    const firstAuthenticate = await authenticate("", password);
    const secondAuthenticate = await authenticate(email, "");

    // then
    await expect(firstAuthenticate).rejects.toThrow(
        "Email and password are required"
    );
    await expect(secondAuthenticate).rejects.toThrow(
        "Email and password are required"
    );
});

test("authentication_InvalidMailFormat_ThrowsErrorEmailIsInvalid", async () => {
    // given
    const validPassword = "ValidPass123!";

    // when
    const firstAuthenticate = authenticate("invalid-email", validPassword);
    const secondAuthenticate = authenticate("user@.com", validPassword);

    // then
    await expect(firstAuthenticate).rejects.toThrow("Invalid email format");
    await expect(secondAuthenticate).rejects.toThrow("Invalid email format");
});

test("authentication_InvalidPasswordFormat_ThrowsErrorPasswordDoesNotMeetRequirements", async () => {
    // given
    const email = "user@example.com";

    // when
    const firstAuthenticate = authenticate(email, "short");
    const secondAuthenticate = authenticate(email, "NoSpecialChar123");

    // then
    await expect(firstAuthenticate).rejects.toThrow(
        "Password must be at least 8 characters long and include a number and special character"
    );
    await expect(secondAuthenticate).rejects.toThrow(
        "Password must be at least 8 characters long and include a number and special character"
    );
});

test("authentication_NominalCase_UserIsAuthenticated", async () => {
    // given
    const email = "user@example.com";
    const password = "ValidPass123!";

    // when
    const result = await authenticate(email, password);

    // then
    expect(result.success).toBe(true);
    expect(result.email).toBe(email);
});

test("authentication_IncorrectLogin_AuthenticationFails", async () => {
    // given
    const email = "user@example.com";
    const password = "InvalidPass123!";

    // when
    const result = await authenticate(email, password);

    // then
    expect(result.success).toBe(false);
    expect(result.message).toBe("Authentication failed");
});