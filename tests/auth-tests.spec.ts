import { expect, test } from "@playwright/test";
import { StatusCodes } from "http-status-codes";
import { LoginDTO } from "./dto/LoginDTO";

const BASE_URL = "https://backend.tallinn-learning.ee";
const JWT_REGEX = /^eyJhb[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;

test("TL-11-1 Login/student returns 200 and JWT", async ({ request }) => {
  const response = await request.post(`${BASE_URL}/login/student`, {
    data: {
      username: "string",
      password: "string",
    },
    headers: {
      "Content-Type": "application/json",
    },
  });

  expect(response.status()).toBe(StatusCodes.OK);

  const jwt_value = await response.text();
  expect(jwt_value).toMatch(JWT_REGEX);
});

test("TL-11-2 Login/student returns 401 if password is incorrect", async ({ request }) => {
  const response = await request.post(`${BASE_URL}/login/student`, {
    data: LoginDTO.createLoginWithBrokenData(),
  });

  expect(response.status()).toBe(StatusCodes.UNAUTHORIZED);
});


test("TL-11-3 Login/student returns 401 if password is missing", async ({ request }) => {
  const response = await request.post(`${BASE_URL}/login/student`, {
    data: { username: "test" },
  });

  expect(response.status()).toBe(StatusCodes.UNAUTHORIZED);
});


test("TL-11-4 Login/student returns 400 if body is missing", async ({ request }) => {
  const response = await request.post(`${BASE_URL}/login/student`);
  expect(response.status()).toBe(StatusCodes.BAD_REQUEST);
});


test("TL-11-5 Login/student returns 405 if incorrect HTTP method is used", async ({ request }) => {
  const response = await request.get(`${BASE_URL}/login/student`);
  expect(response.status()).toBe(StatusCodes.METHOD_NOT_ALLOWED);
});


test("TL-11-6 Login/student returns 400 or 401 if body has invalid structure", async ({ request }) => {
  const response = await request.post(`${BASE_URL}/login/student`, {
    data: { email: "wrongField", id: 123 },
  });


  expect([StatusCodes.BAD_REQUEST, StatusCodes.UNAUTHORIZED]).toContain(response.status());
});