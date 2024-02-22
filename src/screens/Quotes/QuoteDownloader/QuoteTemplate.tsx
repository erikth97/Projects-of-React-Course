import { color } from "native-base/lib/typescript/theme/styled-system";
import { IQuote } from "../../../common/Interfaces";
import { CurrencyFormatter } from "../../../common/functions";
import logoURL from "../../../assets/logo-sistema.png";
import promoURL from "../../../assets/promo.png";

const fecha = () => {
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0");
  let yyyy = today.getFullYear();

  let todaystr = mm + "/" + dd + "/" + yyyy;
  return todaystr;
};

const joinDetails = (item: any, type: number) => {
  if (item) {
    let output = "";
    if (type == 1) {
      output = item.join(", ");
    } else if (type == 2) {
      output = item.map((x: { category: any }) => x.category).join(", ");
    }
    return output.length > 0 ? output : "N/A";
  }
  return "N/A";
};

const styles = `
<head>
<meta charset="utf-8" />
<title>Cotización</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=0" />

<style type="text/css">
      @page {
      margin: 1.3cm;
    }
    * {
        padding: 0;
        margin: 0;
    }

    html,
    body {
        height: 100%;
    }

    .page {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        color: #4C4E52;
        font-size: 14px;
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .seccion {
        margin-top: 8px;
        margin-bottom: 8px;
    }

    h1 {
        font-family: 'Times New Roman', Times, serif;
        font-size: 36px;
        color: #662274;
        margin-top: 8px;
        margin-bottom: 8px;
    }

    .small {
        font-size: 12px
    }

    .xsmall {
        font-size: 9px;
    }

    .large {
        font-size: 18px
    }

    .bold {
        font-weight: bold;
    }

    .purple {
        color: #662274;
    }

    .bg-purple {
        background-color: #662274;
        color: white;
    }

    .heading img {
        position: absolute;
        width: 170px;
        top: 0;
        right: 0;
    }

    .input-group {
        display: flex;
        align-items: baseline;
        gap: 0.5em;
        margin-top: 0.5em;
    }

    .line {
        flex: 1;
        border-bottom: 1px solid gray
    }

    .row {
        display: flex;
    }

    .alt {
        background-color: #F1F3F4;
    }

    .col-left {
        flex: 1;
        border-right: 1px solid #662274;
    }

    .col-right {
        flex: 2;
    }

    .cell {
        padding: 6px 16px;
    }

    .total {
      width: 100%;
      text-align: center;
      padding: 10px;
    }

    .promo {
        flex: 1;
    }

    .promo > div {
      border: 1px dashed gray;
      padding: 10px;
      height: auto;
    }

    .pie {
        padding: 15px 25px;
    }

    .contacto {
        display: flex;
        gap: 10px;
    }

    .promo img {
      width: 100%;
    }
</style>
</head>
`;

export const QuoteTemplate = ({ quote, name, email }: { quote: IQuote; name: string; email: string }) => {
  return (
    <div
      style={{
        margin: "3rem",
        color: " #4c4e52",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div>
        <p style={{ fontSize: "20px" }}>{quote.quote_number}</p>
      </div>
      <div
        style={{
          display: "flex",
          marginTop: "8px",
          marginBottom: "8px",
          justifyContent: "space-between",
        }}
      >
        <h1
          style={{
            fontFamily: "Times New Roman, Times, serif",
            fontSize: " 80px",
            color: "#662274",
            marginTop: "8px",
            marginBottom: "8px",
          }}
        >
          Cotización
        </h1>
        <img src={logoURL} alt="LOGO CHRISTUS MUGUERZA" width={300} />
      </div>
      <div
        style={{
          fontWeight: "bold",
          color: "#662274",
          fontSize: "25px",
        }}
      >
        {quote.hospital.display_name}
      </div>
      <div style={{ marginTop: "8px", marginBottom: "16px", fontSize: "25px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "0.5em", marginTop: "0.5em" }}>
          Paciente:
          <div style={{ flex: 1, borderBottom: "1px solid gray" }}>
            {quote.patient.names} {quote.patient.first_surname} {quote.patient.second_surname}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: "0.5em", marginTop: "0.5em" }}>
          Médico:
          <div style={{ flex: 1, borderBottom: "1px solid gray" }}>
            {quote.doctor.names} {quote.doctor.first_surname} {quote.doctor.second_surname}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: "0.5em", marginTop: "0.5em" }}>
          Procedimiento:
          <div style={{ flex: 1, borderBottom: "1px solid gray" }}>{quote.mprocedure_name}</div>
        </div>
      </div>
      <div style={{ marginTop: "8px", marginBottom: "20px", fontSize: "25px" }}>
        <div
          style={{
            display: "flex",
            backgroundColor: "#662274",
            color: "#FFFFFF",
            fontWeight: "bold",
            padding: "5px",
          }}
        >
          <div style={{ flex: 1, borderRight: "1px solid #662274" }}>
            <div style={{ padding: "6px 16px" }}>Servicio</div>
          </div>
          <div style={{ flex: 2 }}>
            <div style={{ padding: "6px 16px" }}>Detalle</div>
          </div>
        </div>
        <div style={{ display: "flex", backgroundColor: "#f1f3f4", padding: "5px" }}>
          <div style={{ flex: 1, borderRight: "2px solid #662274" }}>
            <div style={{ padding: "6px 16px" }}>Estancia</div>
          </div>
          <div style={{ flex: 2 }}>
            <div style={{ padding: "6px 16px" }}>
              {quote.quote_details.room.amount
                ? `${quote.quote_details.room.amount} dias en ${quote.quote_details.room.category}`
                : ""}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", padding: "5px" }}>
          <div style={{ flex: 1, borderRight: "2px solid #662274" }}>
            <div style={{ padding: "6px 16px" }}>Anestesia</div>
          </div>
          <div style={{ flex: 2 }}>
            <div style={{ padding: "6px 16px" }}>
              {quote.quote_details.anesthesia.amount
                ? `${quote.quote_details.anesthesia.amount} horas en ${quote.quote_details.anesthesia.category}`
                : ""}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", backgroundColor: "#f1f3f4", padding: "5px" }}>
          <div style={{ flex: 1, borderRight: "2px solid #662274" }}>
            <div style={{ padding: "6px 16px" }}>Laboratorio</div>
          </div>
          <div style={{ flex: 2 }}>
            <div style={{ padding: "6px 16px" }}> {joinDetails(quote.quote_details.laboratories.selection, 1)}</div>
          </div>
        </div>
        <div style={{ display: "flex", padding: "5px" }}>
          <div style={{ flex: 1, borderRight: "2px solid #662274" }}>
            <div style={{ padding: "6px 16px" }}>Imagen</div>
          </div>
          <div style={{ flex: 2 }}>
            <div style={{ padding: "6px 16px" }}>{joinDetails(quote.quote_details.imaging.selection, 1)}</div>
          </div>
        </div>
        <div style={{ display: "flex", backgroundColor: "#f1f3f4", padding: "5px" }}>
          <div style={{ flex: 1, borderRight: "2px solid #662274" }}>
            <div style={{ padding: "6px 16px" }}>Materiales y/o equipos a vista</div>
          </div>
          <div style={{ flex: 2 }}>
            <div style={{ padding: "6px 16px" }}>
              {joinDetails(quote.quote_details.additional_material.selection, 2)}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", fontWeight: "bold", fontSize: "20px" }}>
          <div style={{ padding: "6px 16px" }}>Se incluye Material y Medicamento de rutina para procedimiento.</div>
        </div>
        <div style={{ display: "flex" }}>
          <div
            style={{
              padding: "25px",
              width: "100%",
              textAlign: "center",
              backgroundColor: "#662274",
              color: "#FFFFFF",
            }}
          >
            <b>Precio Gastos Hospitalarios: </b>
            <span style={{ fontSize: "25px" }}>{CurrencyFormatter.format(quote.total)}</span>
            <span style={{ fontSize: "15px" }}> IVA incluido</span>
          </div>
        </div>
      </div>
      <div
        style={{
          marginTop: "20px",
          marginBottom: "20px",
          backgroundColor: "#f1f3f4",
          fontWeight: "bold",
          fontSize: "20px",
          padding: "15px 25px",
          color: "#662274",
        }}
      >
        <p>
          * En los casos que aplique, se considerará trato directo con proveedor.
          <br />
          * No incluye costos de materiales y/o equipos a vista (p. ej. Materiales osteosíntesis, implantes, stents,
          balones, etc…).
          <br />
          * Cotización valida al presentarse de manera física y/o digital al momento del ingreso del Paciente en el área
          de admisión del Hospital.
          <br />
          * La contraprestación deberá ser pagada previo a la prestación de los servicios.
          <br />
          * No incluye Honorarios Médicos, atenciones en Urgencias, protocolo o esquema de pruebas COVID-19 ni
          complicaciones. (Por seguridad del personal y pacientes, se podrán solicitar pruebas de antígenos y/o PCR de
          COVID-19 sin previo aviso con cargo para el Paciente).
          <br />* Válido únicamente en {quote.hospital.display_name} (unidad cotizada).
          <br />* No aplica el presupuesto para hallazgos que se puedan encontrar durante la cirugía.
        </p>
      </div>
      <div
        style={{
          marginTop: "8px",
          display: "flex",
          marginBottom: "8px",
          border: "1px dashed gray",
          padding: "10px",
          height: "auto",
          justifyContent: "center",
          width: "auto",
        }}
      >
        <img src={promoURL} alt="PROMOCIÓN" style={{ width: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ fontSize: "20px" }}>
        <div>
          <p>
            *Precios Gastos Hospitalarios no aplica con descuentos adicionales u otras promociones. *La presente
            cotización aplica únicamente a paciente particular. *Formas de Pago: Efectivo o tarjeta débito y crédito
            (MSI de acuerdo con promociones de su banco). *Aplican restricciones. *Vigencia de 15 días a partir de la
            fecha de la cotización.
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <div style={{ display: "flex", flex: 4, alignItems: "baseline", gap: "0.5em", marginTop: "0.5em" }}>
            <p>Contacto: </p>
            <div style={{ display: "flex", flex: 1, borderBottom: "1px solid gray", gap: "10px" }}>
              {name + " - " + email}
            </div>
          </div>
          <div style={{ display: "flex", flex: 1, alignItems: "baseline", gap: "0.5em", marginTop: "0.5em" }}>
            <p>Fecha: </p>
            <div style={{ display: "flex", flex: 1, borderBottom: "1px solid gray", gap: "10px" }}>{fecha()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
