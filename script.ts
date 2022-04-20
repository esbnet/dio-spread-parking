interface Veiculo {
	nome: string;
	placa: string;
	entrada: Date | string;
}

(function () {
	const $ = (query: string): HTMLInputElement | null =>
		document.querySelector(query);

	function calcTempo(mil: number): string {
		const hora = Math.floor(mil / 3600);
		const min = Math.floor((mil % 3600) / 60);
		const seg = mil % 60;
		return `${hora}h ${min}m ${seg}s`;
	}

	function patio() {
		function ler(): Veiculo[] {
			return localStorage.patio ? JSON.parse(localStorage.patio) : [];
		}

		function salvar(veiculos: Veiculo[]) {
			localStorage.setItem("patio", JSON.stringify(veiculos));
		}

		function adicionar(veiculo: Veiculo, salva?: boolean) {
			const row = document.createElement("tr");
			row.innerHTML = `
				<td>${veiculo.nome}</td>
				<td>${veiculo.placa}</td>
				<td>${veiculo.entrada}</td>
				<td>
					<button class="delete" data-placa="${veiculo.placa}">x</button>
				</td>
			`;

			row.querySelector(".delete")?.addEventListener("click", function () {
				remover(this.dataset.placa);
			});

			$("#patio")?.appendChild(row);

			if (salva) {
				salvar([...ler(), veiculo]);
			}
		}

		function remover(placa: string) {
			const { entrada, nome } = ler().find(
				(veiculo) => veiculo.placa === placa
			);

			const tempo = calcTempo(
				(new Date().getTime() - new Date(entrada).getTime()) / 1000
			);

			if (
				!confirm(
					`Deseja remover o veículo ${nome}?\nTempo de permanência: ${tempo}`
				)
			)
				return;

			salvar(ler().filter((veiculo) => veiculo.placa !== placa));
			render();
		}

		function render() {
			$("#patio")!.innerHTML = "";
			const patio = ler();
			if (patio.length) {
				patio.forEach((veiculo) => adicionar(veiculo));
			}
		}

		return { adicionar, ler, salvar, remover, render };
	}

	patio().render();

	$("#cadastrar")?.addEventListener("click", () => {
		const nome = $("#nome")?.value;
		const placa = $("#placa")?.value;
		if (!nome || !placa) {
			alert("Preencha todos os campos!");
			return;
		}

		patio().adicionar({ nome, placa, entrada: new Date().toISOString() }, true);
	});
})();
