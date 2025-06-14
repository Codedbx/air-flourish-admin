export function CustomButton({ type = "button", children, ...rest }) {
  return (
    <button type={type} {...rest}>
      {children}
    </button>
  );
}
