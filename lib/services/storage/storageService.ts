"use client";

import { createClient } from "@/lib/supabase/client";

export type UploadFileParams = {
  bucket: string;

  path: string;

  file: File;

  upsert?: boolean;
};

class StorageService {
  private supabase = createClient();

  async upload({
    bucket,
    path,
    file,
    upsert = true,
  }: UploadFileParams) {
    const { data, error } =
      await this.supabase.storage
        .from(bucket)
        .upload(path, file, {
          upsert,
          contentType: file.type,
        });

    if (error) {
      throw error;
    }

    return data;
  }

  async remove(
    bucket: string,
    path: string,
  ) {
    if (!path) {
      return;
    }

    const { error } =
      await this.supabase.storage
        .from(bucket)
        .remove([path]);

    if (error) {
      throw error;
    }
  }

  getPublicUrl(
    bucket: string,
    path: string,
  ) {
    if (!path) {
      return "";
    }

    const { data } =
      this.supabase.storage
        .from(bucket)
        .getPublicUrl(path);

    return data.publicUrl;
  }

  async download(
    bucket: string,
    path: string,
  ) {
    const { data, error } =
      await this.supabase.storage
        .from(bucket)
        .download(path);

    if (error) {
      throw error;
    }

    return data;
  }

  async uploadCotacaoPdf(
  cotacaoId: string,
  cotacaoSeguradoraId: string,
  file: File,
) {
  if (!cotacaoId) {
    throw new Error(
      "Cotação não informada.",
    );
  }

  if (!cotacaoSeguradoraId) {
    throw new Error(
      "Cotação da seguradora não informada.",
    );
  }

  const extensao =
    file.name.split(".").pop() ??
    "pdf";

  const path = `${cotacaoId}/${cotacaoSeguradoraId}.${extensao}`;

  await this.upload({
    bucket: "cotacoes-pdf",
    path,
    file,
    upsert: true,
  });

  return path;
}

async getSignedUrl(
  bucket: string,
  path: string,
  expiresIn = 300,
) {
  const { data, error } =
    await this.supabase.storage
      .from(bucket)
      .createSignedUrl(
        path,
        expiresIn,
      );

  if (error) {
    throw error;
  }

  return data.signedUrl;
}

}

export const storageService =
  new StorageService();