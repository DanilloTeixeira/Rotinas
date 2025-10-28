// Definir data atual no campo
        const dataAtualInput = document.getElementById('dataAtual');
        const hoje = new Date();
        dataAtualInput.valueAsDate = hoje;

        // Função para copiar texto
        function copiarTexto(elementId, botao) {
            const elemento = document.getElementById(elementId);
            const texto = elemento.textContent;

            // Verifica se o texto é válido (não é placeholder)
            if (texto === '--.--.----' || texto === '--------' || texto === 'C_--------') {
                return;
            }

            navigator.clipboard.writeText(texto).then(() => {
                // Feedback visual
                const textoOriginal = botao.innerHTML;
                botao.innerHTML = '✓ Copiado!';
                botao.classList.add('copied');

                setTimeout(() => {
                    botao.innerHTML = textoOriginal;
                    botao.classList.remove('copied');
                }, 2000);
            }).catch(err => {
                console.error('Erro ao copiar:', err);
            });
        }

        // Função para calcular validade
        function calcularValidade() {
            const dataAtual = dataAtualInput.value;
            const dias = parseInt(document.getElementById('diasValidade').value);

            if (!dataAtual || isNaN(dias)) {
                document.getElementById('dataValidadeResult').textContent = '--.--.----';
                return;
            }

            const data = new Date(dataAtual + 'T00:00:00');
            data.setDate(data.getDate() + dias);

            const dia = String(data.getDate()).padStart(2, '0');
            const mes = String(data.getMonth() + 1).padStart(2, '0');
            const ano = data.getFullYear();

            document.getElementById('dataValidadeResult').textContent = `${dia}.${mes}.${ano}`;
        }

        // Função para gerar ID
        function gerarID() {
            const nomeCompleto = document.getElementById('nomeCompleto').value.trim().toUpperCase();
            
            if (!nomeCompleto) {
                document.getElementById('idPrincipal').textContent = '--------';
                document.getElementById('idPrefixo').textContent = 'C_--------';
                return;
            }

            // Remover caracteres especiais e múltiplos espaços
            const nomeClean = nomeCompleto.replace(/[^A-Z\s]/g, '').replace(/\s+/g, ' ');
            const partes = nomeClean.split(' ');

            if (partes.length === 0 || partes[0] === '') {
                document.getElementById('idPrincipal').textContent = '--------';
                document.getElementById('idPrefixo').textContent = 'C_--------';
                return;
            }

            let nome = partes[0];
            let sobrenome = partes.length > 1 ? partes[partes.length - 1] : '';

            let id = '';

            // Lógica de geração do ID
            if (sobrenome.length >= 6) {
                // Usa 6 letras do sobrenome + 2 do nome
                id = sobrenome.substring(0, 6) + nome.substring(0, 2);
            } else {
                // Sobrenome tem menos de 6 letras
                id = sobrenome;
                let restante = 8 - sobrenome.length;
                
                // Completa com letras do nome
                if (nome.length >= restante) {
                    id += nome.substring(0, restante);
                } else {
                    // Nome não é suficiente, adiciona todo o nome
                    id += nome;
                    // Completa com números sequenciais
                    let numerosFaltantes = 8 - id.length;
                    for (let i = 0; i < numerosFaltantes; i++) {
                        id += '0';
                    }
                }
            }

            // Garante que o ID tenha exatamente 8 caracteres
            id = id.substring(0, 8).padEnd(8, '0');

            document.getElementById('idPrincipal').textContent = id;
            document.getElementById('idPrefixo').textContent = 'C_' + id;
        }

        // Event listeners
        dataAtualInput.addEventListener('change', calcularValidade);
        document.getElementById('diasValidade').addEventListener('input', calcularValidade);
        document.getElementById('nomeCompleto').addEventListener('input', gerarID);

        // Inicialização
        calcularValidade();