import {
  NextResponse,
} from "next/server";

import {
  createClient,
} from "@/lib/supabase/server";

type Context = {
  params: Promise<{
    token: string;
  }>;
};

export async function GET(
  _request: Request,
  context: Context,
) {
  const {
    token,
  } =
    await context.params;

  if (!token) {
    return new NextResponse(
      "Documento não encontrado.",
      {
        status: 404,
      },
    );
  }

  const supabase =
    await createClient();

  const {
    data,
    error,
  } =
    await supabase.rpc(
      "resolver_documento_link",
      {
        p_token:
          token,
      },
    );

  if (
    error ||
    !data
  ) {
    return new NextResponse(
      "Este link não existe ou já expirou.",
      {
        status: 404,
        headers: {
          "Content-Type":
            "text/plain; charset=utf-8",
        },
      },
    );
  }

  return NextResponse.redirect(
    String(data),
    302,
  );
}
