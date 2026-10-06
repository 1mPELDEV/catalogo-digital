function ModalConfirmacao({ aberto, titulo, mensagem, onConfirmar, onCancelar }) {

  if (!aberto) return null

  return (
    <div
      role="presentation"
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-[fadeBg_0.2s_ease]"
      onClick={onCancelar}
    >

      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirmacao-titulo"
        aria-describedby="confirmacao-mensagem"
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg text-center animate-[modalPop_0.3s_cubic-bezier(0.22,1,0.36,1)]"
      >

        <h3 id="confirmacao-titulo" className="text-lg font-semibold mb-2">
          {titulo}
        </h3>

        <p id="confirmacao-mensagem" className="text-gray-600 mb-4">
          {mensagem}
        </p>

        <div className="flex gap-2">

          <button 
            onClick={onConfirmar}
            type="button"
            className="flex-1 bg-red-600 text-white p-2 rounded hover:bg-red-700 transition"
          >
            Confirmar
          </button>

          <button 
            onClick={onCancelar}
            type="button"
            className="flex-1 bg-gray-200 p-2 rounded hover:bg-gray-300 transition"
          >
            Cancelar
          </button>

        </div>

      </div>
    </div>
  )
}

export default ModalConfirmacao
