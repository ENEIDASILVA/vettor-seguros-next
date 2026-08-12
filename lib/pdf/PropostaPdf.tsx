import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

export type PropostaPdfSeguradora = {
  nome: string;

  premioTotal: number | null;

  franquiaNormal: number | null;

  percentualFipe: number | null;

  assistencia: string | null;

  formaPagamento: string | null;

  parcelamento: string | null;

  parcelaMaxima: number | null;
};

export type PropostaPdfDados = {
  clienteNome: string;

  tipoSeguroNome: string;

  observacoes: string;

  validadeDias: number;

  seguradoras: PropostaPdfSeguradora[];
};

type Props = {
  dados: PropostaPdfDados;
};

const styles =
  StyleSheet.create({
    page: {
      padding: 36,
      fontFamily: "Helvetica",
      fontSize: 10,
      color: "#1E293B",
    },

    header: {
      backgroundColor: "#0A2F5A",
      padding: 18,
      borderRadius: 6,
      marginBottom: 22,
    },

    brand: {
      color: "#FFFFFF",
      fontSize: 22,
      fontWeight: 700,
    },

    subtitle: {
      marginTop: 5,
      color: "#E2E8F0",
      fontSize: 10,
    },

    infoGrid: {
      flexDirection: "row",
      gap: 10,
      marginBottom: 20,
    },

    infoCard: {
      flex: 1,
      backgroundColor: "#F8FAFC",
      border: "1 solid #E2E8F0",
      padding: 12,
      borderRadius: 5,
    },

    label: {
      color: "#64748B",
      fontSize: 8,
      marginBottom: 4,
    },

    value: {
      fontSize: 12,
      fontWeight: 700,
      color: "#0F172A",
    },

    sectionTitle: {
      fontSize: 13,
      fontWeight: 700,
      color: "#0A2F5A",
      marginBottom: 10,
    },

    seguradoraCard: {
      border: "1 solid #CBD5E1",
      borderRadius: 6,
      padding: 14,
      marginBottom: 12,
    },

    seguradoraNome: {
      color: "#0A2F5A",
      fontSize: 14,
      fontWeight: 700,
      marginBottom: 10,
    },

    row: {
      flexDirection: "row",
      marginBottom: 8,
    },

    cell: {
      width: "50%",
      paddingRight: 8,
    },

    cellLabel: {
      color: "#64748B",
      fontSize: 8,
      marginBottom: 2,
    },

    cellValue: {
      fontSize: 10,
      fontWeight: 700,
    },

    observations: {
      marginTop: 8,
      backgroundColor: "#F8FAFC",
      border: "1 solid #E2E8F0",
      borderRadius: 5,
      padding: 12,
    },

    footer: {
      marginTop: 24,
      borderTop: "1 solid #E2E8F0",
      paddingTop: 12,
      color: "#64748B",
      fontSize: 8,
      textAlign: "center",
    },
  });

function moeda(
  valor: number | null,
) {
  if (
    valor === null ||
    valor === undefined
  ) {
    return "-";
  }

  return valor.toLocaleString(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL",
    },
  );
}

export default function PropostaPdf({
  dados,
}: Props) {
  return (
    <Document>
      <Page
        size="A4"
        style={styles.page}
      >
        <View style={styles.header}>
          <Text style={styles.brand}>
            VETTOR SEGUROS
          </Text>

          <Text style={styles.subtitle}>
            Proposta Comercial de Seguro
          </Text>
        </View>

        <View style={styles.infoGrid}>
          <View style={styles.infoCard}>
            <Text style={styles.label}>
              CLIENTE
            </Text>

            <Text style={styles.value}>
              {dados.clienteNome}
            </Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.label}>
              SEGURO
            </Text>

            <Text style={styles.value}>
              {dados.tipoSeguroNome}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          Opções selecionadas
        </Text>

        {dados.seguradoras.map(
          (
            seguradora,
            index,
          ) => (
            <View
              key={`${seguradora.nome}-${index}`}
              style={styles.seguradoraCard}
              wrap={false}
            >
              <Text style={styles.seguradoraNome}>
                {seguradora.nome}
              </Text>

              <View style={styles.row}>
                <View style={styles.cell}>
                  <Text style={styles.cellLabel}>
                    PRÊMIO TOTAL
                  </Text>

                  <Text style={styles.cellValue}>
                    {moeda(
                      seguradora.premioTotal,
                    )}
                  </Text>
                </View>

                <View style={styles.cell}>
                  <Text style={styles.cellLabel}>
                    FRANQUIA
                  </Text>

                  <Text style={styles.cellValue}>
                    {moeda(
                      seguradora.franquiaNormal,
                    )}
                  </Text>
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.cell}>
                  <Text style={styles.cellLabel}>
                    COBERTURA FIPE
                  </Text>

                  <Text style={styles.cellValue}>
                    {seguradora.percentualFipe !==
                    null
                      ? `${seguradora.percentualFipe}%`
                      : "-"}
                  </Text>
                </View>

                <View style={styles.cell}>
                  <Text style={styles.cellLabel}>
                    ASSISTÊNCIA
                  </Text>

                  <Text style={styles.cellValue}>
                    {seguradora.assistencia ||
                      "-"}
                  </Text>
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.cell}>
                  <Text style={styles.cellLabel}>
                    FORMA DE PAGAMENTO
                  </Text>

                  <Text style={styles.cellValue}>
                    {seguradora.formaPagamento ||
                      "-"}
                  </Text>
                </View>

                <View style={styles.cell}>
                  <Text style={styles.cellLabel}>
                    PARCELAMENTO
                  </Text>

                  <Text style={styles.cellValue}>
                    {seguradora.parcelamento ||
                      (seguradora.parcelaMaxima
                        ? `Até ${seguradora.parcelaMaxima}x`
                        : "-")}
                  </Text>
                </View>
              </View>
            </View>
          ),
        )}

        <Text style={styles.sectionTitle}>
          Observações comerciais
        </Text>

        <View style={styles.observations}>
          <Text>
            {dados.observacoes ||
              "Sem observações adicionais."}
          </Text>
        </View>

        <View
          style={[
            styles.observations,
            {
              marginTop: 12,
            },
          ]}
        >
          <Text>
            Validade desta proposta:{" "}
            {dados.validadeDias} dias.
          </Text>
        </View>

        <Text style={styles.footer}>
          Vettor Seguros • vettorseguros.com.br • (31) 99353-9953
        </Text>
      </Page>
    </Document>
  );
}