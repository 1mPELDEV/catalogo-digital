function ModalConfirmacao({ aberto, titulo, mensagem, onConfirmar, onCancelar }) {

  if (!aberto) return null

  return (
    <div style={styles.overlay} onClick={onCancelar}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>

        <h3>{titulo}</h3>
        <p>{mensagem}</p>

        <div style={{display:"flex", gap:"10px", marginTop:"15px"}}>

          <button onClick={onConfirmar}>
            Confirmar
          </button>

          <button onClick={onCancelar}>
            Cancelar
          </button>

        </div>

      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000
  },
  modal: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    width: "300px",
    textAlign: "center"
  }
}

export default ModalConfirmacao