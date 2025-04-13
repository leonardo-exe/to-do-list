//vetor de objetos que guarda todos os dados passados em formulário
const dados = JSON.parse(localStorage.getItem('to-do list') || [{dsem: 1}]) || [{dsem: 1}]
const data = new Date()
document.querySelector('span#ano').textContent = `${data.getFullYear()}`
const diaHoje = data.getDate()
const mesHoje = data.getMonth()+1
const anoAtual = data.getFullYear()
const bissexto = (anoAtual % 400 == 0 || (anoAtual % 4 == 0 && anoAtual % 100 != 0)) ? 366 : 365
const cabeçalho = (i, j) => `${i.toString().padStart(2, '0')}/${j.toString().padStart(2, '0')}/${anoAtual}`
const diasNOmes = (mes) => {
    switch (mes) {
        case 1: return 31
        case 2: return bissexto == 366 ? 29 : 28
        case 3: return 31
        case 4: return 30
        case 5: return 31
        case 6: return 30
        case 7: return 31
        case 8: return 31
        case 9: return 30
        case 10: return 31
        case 11: return 30
        case 12: return 31
    }
}
const mesEscrito = (mes) => {
    switch (mes) {
        case 1: return 'janeiro'
        case 2: return 'fevereiro'
        case 3: return 'março'
        case 4: return 'abril'
        case 5: return 'maio'
        case 6: return 'junho'
        case 7: return 'julho'
        case 8: return 'agosto'
        case 9: return 'setembro'
        case 10: return 'outubro'
        case 11: return 'novembro'
        case 12: return 'dezembro'
    }
}
const diasNAsemana = (dia) => {
    switch (dia) {
        case 1: return 'Domingo'
        case 2: return 'Segunda-feira'
        case 3: return 'Terça-feira'
        case 4: return 'Quarta-feira'
        case 5: return 'Quinta-feira'
        case 6: return 'Sexta-feira'
        case 7: return 'Sábado'
    }
}
for (let i = mesHoje, k = 0, ds = dados[0].dsem; i <= 12; i++) {
    for (let j = diaHoje; j <= diasNOmes(i); j++, k++) {
        if (!dados[k] || !dados[k].tarefas) {   
            dados[k] = {}
            dados[k]['data'] = cabeçalho(j, i)
            dados[k]['dsem'] = ds
            dados[k]['tarefas'] = []
            ds++
            ds = ds > 7 ? 1 : ds
        }
    }
}          
const indexAtual = dados.findIndex(item => item.data === cabeçalho(diaHoje, mesHoje));
if (indexAtual > 0) {
    dados.splice(0, indexAtual);
}
{
    for (let i in dados) {
        const mae = document.querySelector('div#mae')
        const filha = document.createElement('div')
        filha.className = 'filha'
        filha.innerHTML = `<pre>  ${dados[i].data} ${diasNAsemana(dados[i].dsem)}<pre>`
        mae.appendChild(filha)
        
    }
}
{
    const sdia = document.getElementsByClassName('select')[0]
    const smes = document.getElementsByClassName('select')[1]
    document.querySelector('input#check').addEventListener('click', function () {
        document.querySelector('div#repete').style.display = document.querySelector('div#repete').style.display == 'flex' ? 'none' : 'flex'
    })
    for (let i = 1; i <= 31; i++) {
        const opcao = document.createElement('option')
        opcao.innerHTML = i.toString().padStart(2,'0')
        opcao.value = i.toString().padStart(2,'0')
        sdia.appendChild(opcao)
    }
    for (let i = mesHoje; i <= 12; i++) {
        const opcao = document.createElement('option')
        opcao.innerHTML = mesEscrito(i)
        opcao.value = i.toString().padStart(2,'0')
        smes.appendChild(opcao)
    }
}
function submete () {
    const ids = [
        document.getElementsByClassName('input')[0].value,
        document.getElementsByClassName('input')[1].value,
        document.getElementsByClassName('select')[0].value,
        document.getElementsByClassName('select')[1].value,
        document.querySelector('input#color').value,
    ]
    ids.push(cabeçalho(ids[2],ids[3]))
    for (let l in dados) 
        if (dados[l].data === ids[5])
            dados[l].tarefas.push({
                nome: ids[0],
                hora: ids[1] || '',
                cor: ids[4],
            })
    const check = []
    for (let i = 0; i < 7; i++)
        check.push(document.getElementsByClassName('checkbox')[i])
    for (let i in check)
        if (check[i].checked) {
            for (let j in dados) {
                if (dados[j].dsem == check[i].value)
                    dados[j].tarefas.push({
                        nome: ids[0],
                        hora: ids[1] || '',
                        cor: ids[4],
                    })
            }
        }
    localStorage.setItem('to-do list', JSON.stringify(dados))
    window.location.reload()
}
function construtora (vetorDeTarefas, index) {
    const divFilha = document.getElementsByClassName('filha')[index]
    if (JSON.stringify(vetorDeTarefas) === '[]') {
        const neta = document.createElement('div')
        neta.innerHTML = 'livre'
        neta.className = 'neta'
        neta.style.cursor = 'auto'
        divFilha.appendChild(neta)
        return
    }
    vetorDeTarefas.sort((a, b) => a.hora.localeCompare(b.hora))
    for (let i in vetorDeTarefas) {
        const neta = document.createElement('div')
        neta.innerHTML = vetorDeTarefas[i].nome + ' ' + vetorDeTarefas[i].hora
        neta.style.backgroundColor = vetorDeTarefas[i].cor
        neta.className = 'neta'
        neta.addEventListener('click', function () {
            const div = document.createElement('div')
            div.id = 'cancel'
            div.innerHTML = '<h1>Quer mesmo cancelar a tarefa?</h1>'
            const input1 = document.createElement('input')
            input1.type = 'submit'
            input1.value = 'sim'
            input1.addEventListener('click', function () {
                dados[index].tarefas.splice(i, 1)
                localStorage.setItem('to-do list', JSON.stringify(dados))
                window.location.reload()
            
            })
            const input2 = document.createElement('input')
            input2.type = 'submit'
            input2.value = 'não'
            input2.addEventListener('click', function () {
                div.style.display = 'none'
            })
            const input3 = document.createElement('input')
            input3.type = 'submit'
            input3.value = 'excluir tarefas desse dia' 
            input3.addEventListener('click', function () {
                const div1 = document.createElement('div')
                div1.id = 'cancel'
                div1.innerHTML = '<h1>Excluir dia da semana</h1>'
                document.querySelector('body').appendChild(div1)
                div.style.display = 'none'
                const input1 = document.createElement('input')
                input1.type = 'submit'
                input1.value = 'voltar'
                input1.addEventListener('click', function () {
                    div1.style.display = 'none'
                    div.style.display = 'flex'
                })
                const input2 = document.createElement('input')
                input2.type = 'submit'
                input2.value = `excluir tarefas de todas as ${diasNAsemana(dados[index].dsem)}`
                input2.addEventListener('click', function () {
                    const esseDia = dados[index].dsem
                    for (let i in dados) 
                        if (dados[i].dsem == esseDia)
                            dados[i].tarefas = []
                    localStorage.setItem('to-do list', JSON.stringify(dados))
                    window.location.reload()    
                })
                const input3 = document.createElement('input')
                input3.type = 'submit'
                input3.value = 'excluir tarefas desse dia' 
                input3.addEventListener('click', function () {
                    dados[index].tarefas = []
                    localStorage.setItem('to-do list', JSON.stringify(dados))
                    window.location.reload()    
                })
                div1.appendChild(input1)
                div1.appendChild(input2)
                div1.appendChild(input3)
            })
            div.appendChild(input1)
            div.appendChild(input2)
            div.appendChild(input3)
            document.querySelector('body').appendChild(div)
        })
        divFilha.appendChild(neta)
    }
}
{
    for (let i in dados) 
        if (dados[i].tarefas)
            construtora(dados[i].tarefas, i)
}
localStorage.setItem('to-do list', JSON.stringify(dados))
// Calcula o tamanho total usado no localStorage em bytes
function checkLocalStorageSpace() {
    function getLocalStorageUsage() {
        let total = 0
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                total += localStorage[key].length * 2
            }
        }
        return total
    }
    const max = 5 * 1024 * 1024; // 5MB em bytes
    const used = getLocalStorageUsage();
    const remaining = max - used;
    
    console.log(`Usado: ${(used / 1024).toFixed(2)} KB`);
    console.log(`Restante: ${(remaining / 1024).toFixed(2)} KB`);
    console.log(`Percentual usado: ${((used / max) * 100).toFixed(2)}%`);
}
checkLocalStorageSpace();
function exclusivo (b, c, dias) {
    return function () {
        b.checked = false
        c.checked = false
        for (let i in dados) {
            if (Number(i) >= dias)
                document.getElementsByClassName('filha')[Number(i)].style.display = 'none'
            else 
                document.getElementsByClassName('filha')[Number(i)].style.display = 'flex'
        }
        if (!(semana.checked || mes.checked || ano.checked))
            for (let i in dados)
                document.getElementsByClassName('filha')[Number(i)].style.display = 'none'    
    }
}
const semana = document.querySelector('input#s')
const mes = document.querySelector('input#m')
const ano = document.querySelector('input#a')
semana.addEventListener('click', exclusivo(mes, ano, 7))
mes.addEventListener('click', exclusivo(semana, ano, diasNOmes(mesHoje)))
ano.addEventListener('click', exclusivo(semana, mes, bissexto))
