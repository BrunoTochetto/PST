async function runTest() {
  console.log('=== INICIANDO TESTE DO FLUXO COMPLETO DE CADASTRO E LOCALIZAÇÃO ===');

  const BASE_URL = 'http://localhost:3000';

  // 1. Autenticação real
  console.log('\n1. Efetuando login...');
  const loginRes = await fetch(`${BASE_URL}/users/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'ana@email.com', senha: '123456' }),
  });

  const loginData = await loginRes.json();
  if (!loginData.valid || !loginData.token) {
    throw new Error('Falha no login: ' + JSON.stringify(loginData));
  }
  console.log('✔ Login realizado com sucesso. Usuário:', loginData.user.nome);
  console.log('✔ Senha exposta no login?', 'senha' in loginData.user);

  const token = loginData.token;

  // 2. Preparar imagem de teste (PNG base64)
  const testImgBuffer = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    'base64'
  );

  // 3. Cadastrar planta com multipart/form-data
  console.log('\n2. Cadastrando planta com imagem e localização...');
  const latTeste = -27.012345;
  const lngTeste = -51.156789;

  const formData = new FormData();
  formData.append('nome_comum', 'Ipê Amarelo de Teste');
  formData.append('nome_genero', 'Handroanthus');
  formData.append('descricao', 'Árvore símbolo brasileira com floração amarela intensa.');
  formData.append('latitude', latTeste.toString());
  formData.append('longitude', lngTeste.toString());
  formData.append('imagem', new Blob([testImgBuffer], { type: 'image/png' }), 'ipe_amarelo.png');

  const createPlantRes = await fetch(`${BASE_URL}/plants`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData,
  });

  if (!createPlantRes.ok) {
    const errText = await createPlantRes.text();
    throw new Error('Erro ao criar planta: ' + errText);
  }

  const plantCreated = await createPlantRes.json();
  console.log('✔ Planta cadastrada com ID:', plantCreated.id);
  console.log('✔ URL da imagem gerada:', plantCreated.imagem_url);

  // 4. Cadastrar / verificar marcador
  console.log('\n3. Verificando marcador vinculado...');
  const markerRes = await fetch(`${BASE_URL}/markers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      id_planta: plantCreated.id,
      latitude: latTeste,
      longitude: lngTeste
    })
  });

  const markerData = await markerRes.json();
  console.log('✔ Marcador vinculado com ID:', markerData.id);
  console.log(`✔ Coordenadas registradas: Lat ${markerData.latitude}, Lng ${markerData.longitude}`);

  // 5. Testar disponibilidade da imagem via HTTP
  console.log('\n4. Testando persistência e acessibilidade da imagem...');
  const imgFetch = await fetch(plantCreated.imagem_url);
  console.log('✔ Status HTTP da imagem:', imgFetch.status, '(200 OK esperado)');
  if (imgFetch.status !== 200) {
    throw new Error('A imagem não pôde ser baixada!');
  }

  // 6. Consultar a planta e gênero
  console.log('\n5. Consultando planta cadastrada na listagem...');
  const getPlantRes = await fetch(`${BASE_URL}/plants/${plantCreated.id}`);
  const plantDetails = await getPlantRes.json();
  console.log('✔ Nome comum:', plantDetails.nome_comum);
  console.log('✔ Gênero retornado:', plantDetails.genero);
  if (plantDetails.genero !== 'Handroanthus') {
    throw new Error('Gênero incorreto: ' + plantDetails.genero);
  }

  // 7. Consultar marcadores no mapa
  console.log('\n6. Consultando marcadores para a planta no mapa...');
  const getMarkersRes = await fetch(`${BASE_URL}/markers/plant/${plantCreated.id}`);
  const markers = await getMarkersRes.json();
  const plantMarker = markers[0];
  console.log('✔ Marcador encontrado no mapa:', plantMarker);

  const latDiff = Math.abs(parseFloat(plantMarker.latitude) - latTeste);
  const lngDiff = Math.abs(parseFloat(plantMarker.longitude) - lngTeste);
  console.log(`✔ Diferença de coordenadas: Lat diff = ${latDiff}, Lng diff = ${lngDiff}`);

  if (latDiff > 0.0001 || lngDiff > 0.0001) {
    throw new Error('As coordenadas do mapa não correspondem àquelas registradas!');
  }
  console.log('✔ A localização no mapa corresponde EXATAMENTE àquela registrada!');

  console.log('\n=== TESTE CONCLUÍDO COM SUCESSO! ===');
}

runTest().catch(err => {
  console.error('Falha no teste:', err);
  process.exitCode = 1;
});
