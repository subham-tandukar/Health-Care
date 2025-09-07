import { NextResponse } from "next/server";

export function handleSuccessResponse(
  data = null,
  message = "Request Successful",
  status = 200
) {
  return NextResponse.json(
    {
      success: true,
      message,
      ...(data !== null && data !== undefined ? { data } : {}),
    },
    { status }
  );
}

export function handleErrorResponse(error, status = 500) {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
      ? error
      : "An error occurred";

  return NextResponse.json(
    {
      success: false,
      message,
    },
    { status }
  );
}
