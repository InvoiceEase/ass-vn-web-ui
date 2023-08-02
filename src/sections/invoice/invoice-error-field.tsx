interface Props {
  type: string;
}

export default function InvoiceErrorField({ type }: Props) {
  return <div>{type}</div>;
}
