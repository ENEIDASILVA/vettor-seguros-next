import type {
  ReactNode,
} from "react";

import Link from "next/link";

import type {
  Cotacao,
  CotacaoDados,
} from "@/lib/repositories/cotacoesRepository";


type Props = {
  cotacao: Cotacao;
};


type Beneficiario = {
  name?: string;
  nome?: string;
  relationship?: string;
  parentesco?: string;
  percentage?: string | number;
  percentual?: string | number;
};


function lerTexto(
  dados: CotacaoDados,
  campo: string,
): string {
  const valor = dados[campo];

  if (
    valor === null ||
    valor === undefined
  ) {
    return "";
  }

  if (typeof valor === "string") {
    return valor.trim();
  }

  if (
    typeof valor === "number" ||
    typeof valor === "boolean"
  ) {
    return String(valor);
  }

  return "";
}


function lerListaTexto(
  dados: CotacaoDados,
  campo: string,
): string[] {
  const valor = dados[campo];

  if (!Array.isArray(valor)) {
    return [];
  }

  return valor
    .filter(
      (item): item is string =>
        typeof item === "string",
    )
    .map((item) => item.trim())
    .filter(Boolean);
}


function lerBeneficiarios(
  dados: CotacaoDados,
): Beneficiario[] {
  const valor = dados.beneficiaries;

  if (!Array.isArray(valor)) {
    return [];
  }

  return valor.filter(
    (item): item is Beneficiario =>
      typeof item === "object" &&
      item !== null,
  );
}


function valorOuTraco(
  valor: string,
): string {
  return valor || "-";
}


function dataHoraBrasileira(
  valor: string,
): string {
  if (!valor) {
    return "-";
  }

  const data = new Date(valor);

  if (
    Number.isNaN(
      data.getTime(),
    )
  ) {
    return valor;
  }

  return data.toLocaleString(
    "pt-BR",
  );
}


function Campo({
  titulo,
  valor,
}: {
  titulo: string;
  valor: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="mb-2 text-sm font-medium text-slate-500">
        {titulo}
      </p>

      <div className="break-words text-base font-semibold text-slate-800">
        {valor}
      </div>
    </div>
  );
}


function Secao({
  titulo,
  children,
}: {
  titulo: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6">
      <h2 className="mb-5 text-lg font-bold text-slate-800">
        {titulo}
      </h2>

      {children}
    </section>
  );
}


function Grade({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {children}
    </div>
  );
}


export default function CotacaoView({
  cotacao,
}: Props) {
  const dados =
    cotacao.dados ?? {};

  const seguro =
    lerTexto(
      dados,
      "insuranceType",
    ) ||
    cotacao.tipo_seguro?.nome ||
    "-";

  const seguroNormalizado =
    seguro.toLowerCase();

  const seguroAuto =
    seguroNormalizado.includes(
      "auto",
    ) ||
    seguroNormalizado.includes(
      "moto",
    );

  const seguroResidencial =
    seguroNormalizado.includes(
      "resid",
    );

  const seguroVida =
    seguroNormalizado.includes(
      "vida",
    );

  const coberturas =
    lerListaTexto(
      dados,
      "coverages",
    );

  const beneficiarios =
    lerBeneficiarios(dados);

  const observacoesWizard =
    lerTexto(
      dados,
      "observations",
    );

  return (
    <div className="space-y-6">

      <Secao titulo="Informações da Cotação">
        <Grade>
          <Campo
            titulo="Tipo de Seguro"
            valor={seguro}
          />

          <Campo
            titulo="Status"
            valor={
              cotacao.status?.nome ??
              "-"
            }
          />

          <Campo
            titulo="Origem"
            valor={
              cotacao.origem ??
              "-"
            }
          />

          <Campo
            titulo="Recebida em"
            valor={dataHoraBrasileira(
              cotacao.created_at,
            )}
          />

          <Campo
            titulo="Última atualização"
            valor={dataHoraBrasileira(
              cotacao.updated_at,
            )}
          />
        </Grade>
      </Secao>


      <Secao titulo="Dados do Cliente">
        <Grade>
          <Campo
            titulo="Nome"
            valor={valorOuTraco(
              lerTexto(
                dados,
                "name",
              ) ||
              cotacao.cliente?.nome ||
              "",
            )}
          />

          <Campo
            titulo="CPF"
            valor={valorOuTraco(
              lerTexto(
                dados,
                "cpf",
              ),
            )}
          />

          <Campo
            titulo="Telefone"
            valor={valorOuTraco(
              lerTexto(
                dados,
                "phone",
              ),
            )}
          />

          <Campo
            titulo="E-mail"
            valor={valorOuTraco(
              lerTexto(
                dados,
                "email",
              ),
            )}
          />
        </Grade>
      </Secao>


      {seguroAuto && (
        <>
          <Secao titulo="Dados do Veículo">
            <Grade>
              <Campo
                titulo="Tipo de Veículo"
                valor={valorOuTraco(
                  lerTexto(
                    dados,
                    "vehicleType",
                  ),
                )}
              />

              <Campo
                titulo="Marca"
                valor={valorOuTraco(
                  lerTexto(
                    dados,
                    "vehicleBrand",
                  ),
                )}
              />

              <Campo
                titulo="Modelo"
                valor={valorOuTraco(
                  lerTexto(
                    dados,
                    "vehicleModel",
                  ),
                )}
              />

              <Campo
                titulo="Ano / Modelo"
                valor={valorOuTraco(
                  lerTexto(
                    dados,
                    "vehicleYear",
                  ),
                )}
              />

              <Campo
                titulo="Placa"
                valor={valorOuTraco(
                  lerTexto(
                    dados,
                    "vehiclePlate",
                  ),
                )}
              />

              <Campo
                titulo="Combustível"
                valor={valorOuTraco(
                  lerTexto(
                    dados,
                    "vehicleFuel",
                  ),
                )}
              />

              <Campo
                titulo="Zero KM"
                valor={valorOuTraco(
                  lerTexto(
                    dados,
                    "vehicleZeroKm",
                  ),
                )}
              />

              <Campo
                titulo="Uso em aplicativo"
                valor={valorOuTraco(
                  lerTexto(
                    dados,
                    "vehicleApp",
                  ),
                )}
              />

              <Campo
                titulo="Garagem"
                valor={valorOuTraco(
                  lerTexto(
                    dados,
                    "vehicleGarage",
                  ),
                )}
              />

              <Campo
                titulo="Rastreador"
                valor={valorOuTraco(
                  lerTexto(
                    dados,
                    "vehicleTracker",
                  ),
                )}
              />

              <Campo
                titulo="Código FIPE"
                valor={valorOuTraco(
                  lerTexto(
                    dados,
                    "vehicleFipeCode",
                  ),
                )}
              />
            </Grade>
          </Secao>


          <Secao titulo="Endereço de Pernoite">
            <Grade>
              <Campo
                titulo="CEP"
                valor={valorOuTraco(
                  lerTexto(
                    dados,
                    "vehicleCep",
                  ),
                )}
              />

              <Campo
                titulo="Endereço"
                valor={valorOuTraco(
                  lerTexto(
                    dados,
                    "address",
                  ),
                )}
              />

              <Campo
                titulo="Número"
                valor={valorOuTraco(
                  lerTexto(
                    dados,
                    "addressNumber",
                  ),
                )}
              />

              <Campo
                titulo="Complemento"
                valor={valorOuTraco(
                  lerTexto(
                    dados,
                    "addressComplement",
                  ),
                )}
              />

              <Campo
                titulo="Bairro"
                valor={valorOuTraco(
                  lerTexto(
                    dados,
                    "district",
                  ),
                )}
              />

              <Campo
                titulo="Cidade"
                valor={valorOuTraco(
                  lerTexto(
                    dados,
                    "city",
                  ),
                )}
              />

              <Campo
                titulo="Estado"
                valor={valorOuTraco(
                  lerTexto(
                    dados,
                    "state",
                  ),
                )}
              />
            </Grade>
          </Secao>


          <Secao titulo="Dados do Condutor">
            <Grade>
              <Campo
                titulo="Nome do Condutor"
                valor={valorOuTraco(
                  lerTexto(
                    dados,
                    "driverName",
                  ),
                )}
              />

              <Campo
                titulo="Data de Nascimento"
                valor={valorOuTraco(
                  lerTexto(
                    dados,
                    "driverBirthDate",
                  ),
                )}
              />

              <Campo
                titulo="Estado Civil"
                valor={valorOuTraco(
                  lerTexto(
                    dados,
                    "driverMaritalStatus",
                  ),
                )}
              />

              <Campo
                titulo="Profissão"
                valor={valorOuTraco(
                  lerTexto(
                    dados,
                    "driverProfession",
                  ),
                )}
              />

              <Campo
                titulo="É o condutor principal?"
                valor={valorOuTraco(
                  lerTexto(
                    dados,
                    "driverIsMain",
                  ),
                )}
              />

              <Campo
                titulo="Possui condutor secundário?"
                valor={valorOuTraco(
                  lerTexto(
                    dados,
                    "driverHasSecondary",
                  ),
                )}
              />

              <Campo
                titulo="Possui condutor jovem?"
                valor={valorOuTraco(
                  lerTexto(
                    dados,
                    "driverYoung",
                  ),
                )}
              />
            </Grade>
          </Secao>


          <Secao titulo="Histórico do Seguro">
            <Grade>
              <Campo
                titulo="Possui seguro atualmente?"
                valor={valorOuTraco(
                  lerTexto(
                    dados,
                    "currentInsurance",
                  ),
                )}
              />

              <Campo
                titulo="Seguradora atual"
                valor={valorOuTraco(
                  lerTexto(
                    dados,
                    "currentInsurer",
                  ),
                )}
              />

              <Campo
                titulo="Classe de bônus"
                valor={valorOuTraco(
                  lerTexto(
                    dados,
                    "bonusClass",
                  ),
                )}
              />

              <Campo
                titulo="Teve sinistro?"
                valor={valorOuTraco(
                  lerTexto(
                    dados,
                    "hadClaims",
                  ),
                )}
              />

              <Campo
                titulo="Quantidade de sinistros"
                valor={valorOuTraco(
                  lerTexto(
                    dados,
                    "claimsCount",
                  ),
                )}
              />

              <Campo
                titulo="Seguro recusado anteriormente?"
                valor={valorOuTraco(
                  lerTexto(
                    dados,
                    "insuranceRefused",
                  ),
                )}
              />
            </Grade>
          </Secao>
        </>
      )}


      {seguroResidencial && (
        <Secao titulo="Dados do Imóvel">
          <Grade>
            <Campo
              titulo="CEP"
              valor={valorOuTraco(
                lerTexto(
                  dados,
                  "propertyCep",
                ),
              )}
            />

            <Campo
              titulo="Tipo de Imóvel"
              valor={valorOuTraco(
                lerTexto(
                  dados,
                  "propertyType",
                ),
              )}
            />

            <Campo
              titulo="Uso do Imóvel"
              valor={valorOuTraco(
                lerTexto(
                  dados,
                  "propertyUse",
                ),
              )}
            />

            <Campo
              titulo="Situação do Imóvel"
              valor={valorOuTraco(
                lerTexto(
                  dados,
                  "propertyStatus",
                ),
              )}
            />

            <Campo
              titulo="Área"
              valor={valorOuTraco(
                lerTexto(
                  dados,
                  "propertyArea",
                ),
              )}
            />

            <Campo
              titulo="Valor do Imóvel"
              valor={valorOuTraco(
                lerTexto(
                  dados,
                  "propertyValue",
                ),
              )}
            />

            <Campo
              titulo="Alarme"
              valor={valorOuTraco(
                lerTexto(
                  dados,
                  "propertyAlarm",
                ),
              )}
            />

            <Campo
              titulo="Monitoramento"
              valor={valorOuTraco(
                lerTexto(
                  dados,
                  "propertyMonitoring",
                ),
              )}
            />

            <Campo
              titulo="Condomínio Fechado"
              valor={valorOuTraco(
                lerTexto(
                  dados,
                  "propertyGatedCommunity",
                ),
              )}
            />
          </Grade>
        </Secao>
      )}


      {seguroVida && (
        <Secao titulo="Perfil do Seguro de Vida">
          <Grade>
            <Campo
              titulo="Data de Nascimento"
              valor={valorOuTraco(
                lerTexto(
                  dados,
                  "lifeBirthDate",
                ),
              )}
            />

            <Campo
              titulo="Estado Civil"
              valor={valorOuTraco(
                lerTexto(
                  dados,
                  "lifeMaritalStatus",
                ),
              )}
            />

            <Campo
              titulo="Profissão"
              valor={valorOuTraco(
                lerTexto(
                  dados,
                  "lifeProfession",
                ),
              )}
            />

            <Campo
              titulo="Renda Mensal"
              valor={valorOuTraco(
                lerTexto(
                  dados,
                  "lifeMonthlyIncome",
                ),
              )}
            />

            <Campo
              titulo="Capital Segurado"
              valor={valorOuTraco(
                lerTexto(
                  dados,
                  "lifeInsuredCapital",
                ),
              )}
            />

            <Campo
              titulo="Fumante"
              valor={valorOuTraco(
                lerTexto(
                  dados,
                  "lifeSmoker",
                ),
              )}
            />

            <Campo
              titulo="Atividade de Risco"
              valor={valorOuTraco(
                lerTexto(
                  dados,
                  "lifeRiskActivity",
                ),
              )}
            />

            <Campo
              titulo="Pratica Esportes Radicais"
              valor={valorOuTraco(
                lerTexto(
                  dados,
                  "lifeExtremeSports",
                ),
              )}
            />

            <Campo
              titulo="Viagens Frequentes"
              valor={valorOuTraco(
                lerTexto(
                  dados,
                  "lifeFrequentTravel",
                ),
              )}
            />
          </Grade>
        </Secao>
      )}


      {coberturas.length > 0 && (
        <Secao titulo="Coberturas Desejadas">
          <div className="flex flex-wrap gap-3">
            {coberturas.map(
              (cobertura) => (
                <span
                  key={cobertura}
                  className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700"
                >
                  {cobertura}
                </span>
              ),
            )}
          </div>
        </Secao>
      )}


      {beneficiarios.length > 0 && (
        <Secao titulo="Beneficiários">
          <div className="grid gap-4 md:grid-cols-2">
            {beneficiarios.map(
              (
                beneficiario,
                index,
              ) => {
                const nome =
                  beneficiario.name ??
                  beneficiario.nome ??
                  "Não informado";

                const parentesco =
                  beneficiario.relationship ??
                  beneficiario.parentesco ??
                  "-";

                const percentual =
                  beneficiario.percentage ??
                  beneficiario.percentual ??
                  "-";

                return (
                  <div
                    key={`${nome}-${index}`}
                    className="rounded-xl border border-slate-200 bg-white p-5"
                  >
                    <p className="font-semibold text-slate-800">
                      {nome}
                    </p>

                    <p className="mt-2 text-sm text-slate-600">
                      Parentesco:{" "}
                      {parentesco}
                    </p>

                    <p className="mt-1 text-sm text-slate-600">
                      Percentual:{" "}
                      {percentual}
                      {percentual !== "-"
                        ? "%"
                        : ""}
                    </p>
                  </div>
                );
              },
            )}
          </div>
        </Secao>
      )}


      <Secao titulo="Observações">
        <div className="space-y-4">

          <div>
            <p className="mb-2 text-sm font-medium text-slate-500">
              Informadas pelo cliente
            </p>

            <div className="min-h-20 rounded-xl border border-slate-200 bg-white p-4 text-slate-700">
              {observacoesWizard ||
                "Nenhuma observação informada pelo cliente."}
            </div>
          </div>


          <div>
            <p className="mb-2 text-sm font-medium text-slate-500">
              Observações internas
            </p>

            <div className="min-h-20 rounded-xl border border-slate-200 bg-white p-4 text-slate-700">
              {cotacao.observacoes ||
                "Nenhuma observação interna."}
            </div>
          </div>

        </div>
      </Secao>


      <Secao titulo="Proposta Comercial">
        {cotacao.proposta ? (
          <div className="flex flex-wrap items-center justify-between gap-5 rounded-xl border border-blue-200 bg-blue-50 p-5">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Número da Proposta
              </p>

              <p className="mt-1 text-lg font-bold text-slate-800">
                {cotacao.proposta
                  .numeroProposta ||
                  "Número não informado"}
              </p>

              <p className="mt-2 text-sm font-medium text-blue-700">
                Status:{" "}
                {cotacao.proposta.status}
              </p>
            </div>


            <Link
              href={`/admin/propostas/${cotacao.proposta.id}`}
              className="rounded-xl bg-[#0A2F5A] px-5 py-3 font-semibold text-white transition hover:bg-[#082648]"
            >
              Ver Proposta
            </Link>

          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-5 rounded-xl border border-dashed border-slate-300 bg-white p-5">

            <p className="text-slate-600">
              Esta cotação ainda não possui uma proposta comercial.
            </p>


            <Link
              href={`/admin/propostas/nova?cotacaoId=${cotacao.id}`}
              className="rounded-xl bg-green-700 px-5 py-3 font-semibold text-white transition hover:bg-green-800"
            >
              Gerar Proposta
            </Link>

          </div>
        )}
      </Secao>


      <div className="flex flex-wrap justify-end gap-3">

        <Link
          href="/admin/cotacoes"
          className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Voltar
        </Link>


        <Link
          href={`/admin/cotacoes/${cotacao.id}/editar`}
          className="rounded-xl bg-[#0A2F5A] px-5 py-3 font-semibold text-white transition hover:bg-[#082648]"
        >
          Editar Cotação
        </Link>

      </div>

    </div>
  );
}