require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('../config/database');
const { Recurso } = require('../models');

const PALABRAS_POR_MINUTO = 200;
const CIERRE =
  '\n\nSi los sintomas persisten o se intensifican, busca apoyo profesional. Linea Nacional MinSalud: 192 opcion 4.';

function calcularTiempoLectura(texto) {
  const palabras = texto.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(palabras / PALABRAS_POR_MINUTO));
}

const recursos = [
  // ─────────────────────────────── ANSIEDAD (3) ───────────────────────────────
  {
    titulo: 'Tecnica de respiracion 4-7-8 para calmar la mente',
    categoria: 'ansiedad',
    contenido: `Cuando la ansiedad aparece, el cuerpo se prepara para luchar o huir: el corazon se acelera, la respiracion se vuelve corta y rapida, los musculos se tensionan. La buena noticia es que tenemos una herramienta muy poderosa para enviarle al cuerpo la señal contraria, la de calma: nuestra propia respiracion.

La tecnica 4-7-8, desarrollada por el doctor Andrew Weil, ayuda a activar el sistema nervioso parasimpatico, encargado de relajarnos. Es como un boton interno de "pausa" que puedes presionar en cualquier momento del dia.

**Como hacerla, paso a paso:**

1. Sientate comodo, con la espalda recta y los hombros relajados. Apoya la punta de la lengua detras de los dientes superiores y mantenla ahi durante todo el ejercicio.
2. Exhala por completo por la boca, haciendo un sonido suave como un suspiro.
3. Cierra la boca e inhala silenciosamente por la nariz contando hasta 4.
4. Reten la respiracion contando hasta 7.
5. Exhala por la boca, con el sonido del suspiro, contando hasta 8.
6. Esto es un ciclo completo. Repite 4 ciclos.

**Cuando usarla:**

- Cuando notes el pecho oprimido o el corazon acelerado.
- Antes de una situacion que te genera ansiedad (una entrevista, un examen, una conversacion dificil).
- En la noche, si te cuesta conciliar el sueño.
- Como practica diaria, dos veces al dia, para ir entrenando el cuerpo.

**Errores comunes:**

- No te preocupes si al principio te falta el aire en el conteo de 7 u 8. Reduce la duracion pero manten la proporcion. Con la practica, tu capacidad ira aumentando.
- No la hagas mas de 4 ciclos seguidos durante el primer mes. Es mas efectiva poco a poco.
- No la uses como sustituto de una terapia profesional si la ansiedad es severa o cronica.

**Un consejo de quienes la practican:**

Asociala con un momento del dia. Por ejemplo, antes de salir de la cama, o despues de almorzar, o antes de dormir. Cuando se vuelve un habito, tu cuerpo aprende a entrar en calma con mas facilidad.

La respiracion es lo mas accesible que tenemos: no cuesta dinero, no requiere equipo, y siempre esta contigo. Por algo las tradiciones de sabiduria de todas las culturas la han colocado en el centro de sus practicas de bienestar.${CIERRE}`,
    autor: 'Equipo MindVenture - Adaptado de Dr. Andrew Weil',
    fuente: 'MindVenture - Produccion propia',
  },
  {
    titulo: 'Las distorsiones cognitivas y como identificarlas',
    categoria: 'ansiedad',
    contenido: `Nuestra mente no siempre nos cuenta la verdad. A veces, cuando estamos ansiosos o tristes, los pensamientos se distorsionan: vemos las cosas mas oscuras de lo que son, o sacamos conclusiones sin evidencia. La buena noticia es que estos patrones tienen nombre, se pueden identificar y se pueden cambiar.

La terapia cognitivo-conductual (TCC) las llama "distorsiones cognitivas". Conocerlas es el primer paso para no dejarse arrastrar por ellas.

**Las mas comunes:**

- **Pensamiento todo-o-nada:** ver las cosas en blanco y negro. "Si no soy perfecto, soy un fracaso." Ejemplo: te equivocas en una respuesta del examen y piensas "perdi el semestre".
- **Catastrofizacion:** imaginar siempre lo peor. "Si llamo a esta empresa para preguntar, seguro me van a tratar mal y voy a quedar humillado."
- **Lectura de mente:** asumir que sabes lo que otros piensan de ti sin que te lo digan. "Mi jefe ni siquiera me saludo hoy, seguro esta molesto conmigo."
- **Filtro mental:** enfocarte solo en lo negativo e ignorar lo positivo. De diez comentarios sobre tu trabajo, recuerdas solo el critico.
- **Personalizacion:** tomar como propio lo que no depende de ti. "Mi hija saco mala nota, soy una mala madre."
- **Etiquetado:** ponerte una etiqueta global a partir de un evento. "Reprobe la materia, soy un bruto."

**Como cuestionarlas:**

Cuando notes un pensamiento que te dolio, hazle preguntas:

1. ¿Que evidencia tengo de que esto es cierto?
2. ¿Que evidencia tengo de que NO es cierto?
3. ¿Como veria esta situacion alguien que me quiere?
4. ¿Que le diria a un amigo que estuviera pensando esto?
5. ¿Estoy confundiendo un sentimiento con un hecho?

**Un ejemplo cotidiano:**

Maria piensa "nadie me quiere en la oficina" porque hoy nadie la invito a almorzar. Cuando aplica las preguntas, descubre: ayer su compañera Andrea le compro un cafe. La semana pasada un grupo la invito al cumple de Camilo. Hoy varios estaban en reuniones. Su pensamiento era una distorsion (filtro mental + lectura de mente), no la realidad.

**La practica:**

Lleva una libreta o nota en el celular. Cuando sientas un pensamiento que te duele, anotalo, identifica la distorsion y escribe una version mas equilibrada. No se trata de pensar "positivo" forzadamente, sino de pensar **realista**.

Con el tiempo, tu mente se vuelve mas justa contigo mismo.${CIERRE}`,
    autor: 'Equipo MindVenture - Basado en terapia cognitivo-conductual',
    fuente: 'MindVenture - Produccion propia',
  },
  {
    titulo: 'El metodo 5-4-3-2-1 para crisis de ansiedad',
    categoria: 'ansiedad',
    contenido: `Cuando una crisis de ansiedad nos atrapa, el cuerpo se siente fuera de control y la mente parece nublarse. El metodo 5-4-3-2-1 es una herramienta de "anclaje" o **grounding**: nos ayuda a regresar al presente usando nuestros cinco sentidos.

Es especialmente util en ataques de panico, momentos de disociacion, flashbacks, o cuando notas que la mente se acelera y empieza a girar en pensamientos catastroficos.

**Como hacerla, paso a paso:**

Mira a tu alrededor, sea donde sea que estes, y di en voz alta (o mentalmente si estas en publico):

- **5 cosas que puedes VER:** la pared, una taza, un cuaderno, una planta, una luz. Describe cada una con detalle: "veo una taza azul, con el borde un poco gastado, sin asa."
- **4 cosas que puedes TOCAR:** la tela de tu camisa, la textura del piso bajo tus pies, la temperatura del aire en tu cara, la dureza de la silla. Si puedes, tocalas de verdad mientras las nombras.
- **3 cosas que puedes OIR:** el ruido de un carro en la calle, el zumbido de la nevera, tu propia respiracion. Trata de identificar sonidos lejanos y cercanos.
- **2 cosas que puedes OLER:** tu jabon, el cafe, lo que tengas mas cerca. Si no hueles nada, piensa en dos olores que te gustan.
- **1 cosa que puedes SABOREAR:** un sorbo de agua, el sabor que queda en tu boca, una pastilla de menta. Si no tienes nada, recuerda un sabor que te guste.

**Por que funciona:**

Cuando la ansiedad se dispara, la mente viaja al pasado (rumiacion) o al futuro (catastrofizacion). El cuerpo, en cambio, solo existe en el presente. Al obligar a la mente a fijarse en lo que perciben los sentidos AHORA, le quitamos combustible a los pensamientos que la estan asustando.

**Consejos:**

- No te apures. Tomate un minuto en cada paso.
- Si te equivocas en el conteo, no importa. El objetivo no es la perfeccion sino el regreso al presente.
- Practicalo cuando estes tranquilo, para que sea facil de recordar cuando lo necesites.
- Combina con respiracion lenta para potenciar el efecto.

**Para tener a mano:**

Escribe los pasos en una tarjeta o nota del celular. En medio de una crisis, no siempre podemos recordar las cosas. Tener el procedimiento visible te ayudara a empezar.

Esta tecnica viene de la psicologia clinica del trauma y se usa en hospitales y consultorios de todo el mundo. Es simple, gratuita y esta siempre contigo.${CIERRE}`,
    autor: 'Equipo MindVenture - Basado en psicologia clinica del trauma',
    fuente: 'MindVenture - Produccion propia',
  },

  // ─────────────────────────────── DEPRESION (2) ───────────────────────────────
  {
    titulo: 'Activacion conductual: pequeños pasos contra la apatia',
    categoria: 'depresion',
    contenido: `Una de las cosas mas dificiles de la depresion es que te quita la energia para hacer justo lo que mas te ayudaria a sentirte mejor. Si esperas a "tener ganas" para levantarte, bañarte, salir a caminar o llamar a alguien, puedes pasar dias enteros sin moverte.

La **activacion conductual** es una tecnica de la terapia cognitivo-conductual basada en una idea contraintuitiva pero poderosa: **la accion viene antes que la motivacion**, no al reves. Si esperamos a tener ganas, las ganas no llegan. Pero si empezamos a actuar, las ganas pueden aparecer en el camino.

**Como aplicarla:**

1. **Haz una lista de actividades pequeñas que solian darte placer o sentido**, sin filtrar. Cosas como: escuchar una cancion, regar las plantas, bañarte, tomarte un cafe afuera, hablar con tu mama por 5 minutos, hacer una arepa, dibujar, ver el atardecer.
2. **Clasifica cada actividad por dificultad** del 1 al 5, segun como las sientes hoy.
3. **Programa una sola actividad** de dificultad 1 o 2 para mañana. Una. No diez. Una.
4. **Cuando llegue el momento, hazla aunque no sientas nada**. La regla es: no esperes a tener ganas. Solo hazla.
5. **Anota como te sentiste antes, durante y despues**. Casi siempre, "despues" se siente algo mejor que "antes".

**Un ejemplo:**

Carlos lleva dos semanas sin salir del cuarto. Su lista incluye "abrir la ventana". Dificultad: 2. Lo programa para mañana a las 9 a.m. A las 9, no tiene ganas. Aun asi, se levanta y la abre. Tarda 30 segundos. Despues, el aire fresco le hace sentir un milimetro mas vivo. Mañana, tal vez puede ir un poco mas alla: salir al balcon.

**Reglas importantes:**

- **Empieza ridiculamente pequeño.** "Lavar un solo plato" es mejor que "ordenar la cocina". El objetivo es vencer la inercia, no el caos.
- **No te castigues si no lo logras.** Pasa a la siguiente actividad de la lista sin culpa.
- **Celebra cada paso.** Por mas pequeño que sea, hiciste algo que el cerebro deprimido decia que era imposible.
- **No esperes a sentirte bien para hacer cosas; haz cosas para sentirte bien.**

**La trampa del "todo o nada":**

La depresion suele decirnos: "como no puedo ir a trotar 30 minutos, mejor no hago nada". La activacion conductual responde: "puedo caminar 2 minutos hasta la esquina y volver. Eso ya es ganancia."

Cada accion pequeña es una grieta de luz en una habitacion oscura.${CIERRE}`,
    autor: 'Equipo MindVenture - Basado en terapia cognitivo-conductual',
    fuente: 'MindVenture - Produccion propia',
  },
  {
    titulo: 'Higiene del sueño: la base del bienestar emocional',
    categoria: 'depresion',
    contenido: `Cuando dormimos mal, todo se ve peor. La irritabilidad sube, la concentracion baja, la ansiedad y la tristeza se intensifican. El sueño no es un lujo: es una de las bases del bienestar emocional. La buena noticia es que muchos habitos de sueño se pueden mejorar sin medicamentos.

**Que es la higiene del sueño:**

Es el conjunto de habitos y condiciones que ayudan al cuerpo a entrar en sueño profundo de forma natural. Funciona como una "rutina" que le dice al cerebro: ya es hora de descansar.

**Habitos clave:**

- **Acostarse y levantarse a la misma hora**, incluso fines de semana. El cuerpo agradece la regularidad. Variaciones de mas de una hora confunden el reloj biologico.
- **Apagar pantallas 30-60 minutos antes de dormir**. La luz azul del celular y la TV bloquea la melatonina, la hormona del sueño. Si necesitas algo, usa modo nocturno o lee algo en papel.
- **Evitar cafeina despues de las 2 p.m.** El tinto, el te negro y las gaseosas oscuras pueden quedarse en el cuerpo hasta 8 horas.
- **Cenar liviano y al menos 2 horas antes de dormir.** Las digestiones pesadas alteran el sueño profundo.
- **Hacer ejercicio en la mañana o tarde**, no en la noche. El ejercicio activa el cuerpo y dificulta conciliar el sueño si es muy cerca de la hora de dormir.
- **Manten el cuarto fresco, oscuro y silencioso.** Si no puedes controlar la luz, usa antifaces. Si no puedes controlar el ruido, usa tapones.
- **La cama solo para dormir.** No trabajes ni veas series desde la cama si tienes problemas de sueño. El cerebro aprende a asociar la cama con actividad y se le hace mas dificil "apagarse".

**Si no logras dormir en 20 minutos:**

Sal de la cama. Ve a otra habitacion. Haz algo aburrido y con luz tenue: leer un libro suave, organizar un cajon. Cuando sientas sueño, vuelve a la cama. Si sigues sin dormir, repite. Esto rompe la asociacion entre "cama" y "frustracion".

**Una rutina nocturna sugerida:**

- 9:00 p.m. - cena liviana
- 9:30 p.m. - baño tibio, ropa comoda
- 10:00 p.m. - lectura o conversacion tranquila, sin pantallas
- 10:30 p.m. - apagar luces, respiracion 4-7-8 en la cama
- 11:00 p.m. - dormir

**Lo que NO ayuda:**

- Tomarse "una copita" para dormir: el alcohol fragmenta el sueño profundo aunque te haga dormir mas rapido.
- Quedarse en la cama "tratando" de dormir con ansiedad: empeora el insomnio.
- Dormir siestas largas en la tarde (mas de 30 minutos despues de las 4 p.m.).

El sueño no es algo que se consigue forzando, sino algo que se permite. Crea las condiciones, y el cuerpo hara el resto.${CIERRE}`,
    autor: 'Equipo MindVenture - Adaptado de la OMS',
    fuente: 'MindVenture - Produccion propia',
  },

  // ─────────────────────────────── AUTOESTIMA (2) ───────────────────────────────
  {
    titulo: 'El dialogo interno compasivo: hablate como a un buen amigo',
    categoria: 'autoestima',
    contenido: `¿Te has detenido a escuchar como te hablas? Para muchas personas, su voz interna es mas cruel que cualquier enemigo externo: "que bruto fui", "siempre lo arruino todo", "nadie me quiere", "no merezco esto". Lo curioso es que esa voz suele decir cosas que jamas le diriamos a alguien que queremos.

La **auto-compasion**, estudiada por la psicologa Kristin Neff, es la practica de hablarte con la misma amabilidad con la que le hablarias a un buen amigo. No es debilidad ni autoindulgencia: la evidencia muestra que las personas auto-compasivas son **mas resilientes**, mas motivadas y menos propensas a la depresion.

**Los tres pilares:**

- **Auto-amabilidad** (en vez de auto-juicio): tratarte con calidez cuando sufres.
- **Humanidad compartida** (en vez de aislamiento): recordar que el sufrimiento es parte de la experiencia humana, no algo que te pasa solo a ti.
- **Mindfulness** (en vez de sobre-identificacion): observar tu dolor sin exagerarlo ni negarlo.

**Como practicarlo:**

1. **Identifica la voz autocritica.** Cuando notes un pensamiento como "soy un fracaso", paralo y reconocelo: "ahi esta otra vez mi voz dura."
2. **Hazte la pregunta del amigo.** Si tu mejor amigo viniera con este mismo problema, ¿le dirias lo mismo que te dices? Casi siempre la respuesta es no.
3. **Reformula con calidez.** Si tu amigo te dijera "perdi el trabajo", no le dirias "eres un inutil". Le dirias "eso es muy duro, cualquiera se sentiria mal en tu lugar". Date esa misma respuesta.
4. **Pon una mano sobre el corazon.** El contacto fisico libera oxitocina. Una mano calida sobre el pecho mientras te hablas amable amplifica el efecto.
5. **Usa una frase ancla.** Por ejemplo: "este es un momento dificil. El dolor es parte de la vida. Que pueda ser amable conmigo en este momento."

**Un ejemplo real:**

Andrea reprobo un curso despues de meses de esfuerzo. Su primer pensamiento fue "soy una bruta, no sirvo para nada". Aplico el ejercicio: "si mi prima Sara me dijera esto, le diria que reprobar un curso no la define, que es una situacion dolorosa y temporal, y que tiene derecho a sentirse mal sin atacarse." Se repitio eso a si misma, y aunque la tristeza siguio ahi, ya no venia con autoataque.

**No es engaño, es justicia:**

La auto-compasion no es decirte que todo esta bien cuando no lo esta. Es reconocer el dolor sin pegarle al de adentro. No es bajar la exigencia: es subir la dignidad.

Como dice una frase: **"hablate como le hablarias a alguien que amas. Porque tu eres alguien que merece ser amado, empezando por ti mismo."**${CIERRE}`,
    autor: 'Equipo MindVenture - Basado en Kristin Neff',
    fuente: 'MindVenture - Produccion propia',
  },
  {
    titulo: 'Tu valor no depende de lo que produces',
    categoria: 'autoestima',
    contenido: `Vivimos en una cultura que mide a las personas por lo que rinden: cuanto trabajan, cuanto ganan, cuanto consiguen. Crecemos escuchando "que vas a ser cuando grande" como si nuestro valor estuviera atado a una profesion o un sueldo. Cuando nos va mal en eso, sentimos que no valemos nada.

Pero esa ecuacion es falsa. **Tu valor como persona no depende de lo que produces.**

**De donde viene la idea opuesta:**

La psicologia llama a esto **autoestima condicional**: la creencia de que solo valemos cuando logramos algo. Se aprende temprano: los elogios llegan cuando sacamos buena nota, no cuando solo somos. Con el tiempo, internalizamos: "valgo cuando rindo, no valgo cuando descanso, no valgo cuando me equivoco".

Esto genera dos problemas graves:

- **Ansiedad cronica:** vives con miedo de fallar porque fallar significa "no valer".
- **Vacio cuando llegan los logros:** consigues lo que querias y el vacio sigue ahi, porque pusiste tu valor en algo externo que nunca alcanza.

**La verdad incomoda y liberadora:**

Tu valor es **intrinseco**. Vale lo mismo cuando estas dormido que cuando ganas un premio. No subes ni bajas en valor segun tus logros. Tu valor es un piso, no un techo.

**Como empezar a vivir desde ahi:**

1. **Distingue identidad de roles.** Tu eres "Juan", no "Juan-el-ingeniero". Si pierdes el trabajo, sigues siendo Juan.
2. **Observa tu lenguaje.** Cambia "soy un fracaso" por "esto que hice no funciono". El verbo "ser" se usa para identidades; los hechos se describen con verbos especificos.
3. **Practica el descanso sin culpa.** Descansar no es perder el tiempo: es reconocer que vales aunque no produzcas en ese momento.
4. **Identifica una cualidad humana propia.** No un logro. Tal vez eres alguien atento, o paciente, o curioso, o que escucha. Esas cualidades no se pierden cuando falla un proyecto.
5. **Rodeate de personas que te quieren por ser, no por lograr.** Y se esa persona para alguien mas.

**Una imagen util:**

Imaginate un bebe recien nacido. ¿Cuanto vale? Vale infinitamente. ¿Que ha producido? Nada. Solo respira. Pero nadie en su sano juicio diria que un bebe vale menos porque "no rinde". Pues bien: tu fuiste ese bebe. Y ese valor no se perdio, solo se olvido.

**Un ejercicio para hoy:**

Antes de dormir, completa estas tres frases:
- "Hoy valgo aunque..."
- "Hoy valgo porque soy..."
- "Mañana valgo lo mismo, haga lo que haga."

Repetir esto durante semanas reordena el cerebro lentamente. Tu valor no se gana ni se pierde. Solo se reconoce.${CIERRE}`,
    autor: 'Equipo MindVenture',
    fuente: 'MindVenture - Produccion propia',
  },

  // ─────────────────────────────── RELACIONES (1) ───────────────────────────────
  {
    titulo: 'Comunicacion asertiva: expresar sin agredir',
    categoria: 'relaciones',
    contenido: `¿Te ha pasado que sales de una conversacion con bronca, sintiendo que no dijiste lo que querias o que terminaste atacando al otro? La **comunicacion asertiva** es el arte de expresar lo que sientes, piensas y necesitas, **sin agredir** al otro y **sin tragarte** lo tuyo.

Es el punto medio entre dos extremos no saludables:

- **Pasividad:** no decir nada, aguantarse, acumular resentimiento.
- **Agresividad:** desbordarse, gritar, ofender, dejarse llevar por la rabia.

La asertividad te permite poner limites, expresar emociones y defender tus necesidades con respeto, hacia el otro y hacia ti mismo.

**La formula basica: la frase en YO**

En lugar de empezar con "tu eres", "tu hiciste", "tu siempre" (que el otro escucha como ataque y se cierra), empieza con como te sientes y que necesitas:

"Cuando [hecho concreto], yo me siento [emocion], y necesito [pedido especifico]."

**Ejemplos:**

- Pasivo: "no, tranquilo, no me molesta..." (mientras hierves por dentro).
- Agresivo: "siempre haces lo mismo, eres un irrespetuoso."
- **Asertivo:** "cuando llegas dos horas tarde sin avisar, yo me siento poco importante, y necesito que me avises si vas a tardar."

¿Notas la diferencia? El asertivo describe un hecho, expresa una emocion y hace un pedido claro. No ataca a la persona, ataca la conducta. Y sobre todo, no se queda callado.

**Cinco pautas practicas:**

1. **Habla en primera persona.** "Yo siento", "yo necesito". No "tu me haces sentir".
2. **Se especifico.** "Esta semana llegaste tres veces tarde", no "siempre llegas tarde".
3. **Separa hecho de interpretacion.** El hecho es lo verificable; la interpretacion es lo que tu mente arma. "No me llamaste" es un hecho. "No te importo" es una interpretacion.
4. **Cuida el tono y el momento.** Asertividad sin volumen alto ni agresion. Y elige un momento donde ambos puedan escuchar (no cuando alguien esta saliendo de afan al trabajo).
5. **Tienes derecho a decir no.** "No puedo este sabado" es una frase completa. No requiere justificacion ni disculpas excesivas.

**Cuando te cuesta:**

- **Practica en escenarios bajos:** pedirle al mesero que cambie tu plato, pedir un favor pequeño. Estos "ensayos" entrenan el musculo.
- **Acepta que el otro puede no recibirlo bien.** Tu eres responsable de como lo dices, no de como lo reciben.
- **Prepara la frase antes** si la conversacion te genera mucha ansiedad. Escribela.

**Un derecho fundamental:**

Tienes derecho a ser tratado con respeto, a expresar tus sentimientos, a equivocarte, a decir "no se", a cambiar de opinion, a pedir lo que necesitas, y a que no siempre te aprueben. Estos derechos no son privilegio: son la base de relaciones sanas.${CIERRE}`,
    autor: 'Equipo MindVenture',
    fuente: 'MindVenture - Produccion propia',
  },

  // ─────────────────────────────── MEDITACION (2) ───────────────────────────────
  {
    titulo: 'Mindfulness para principiantes: 5 minutos al dia',
    categoria: 'meditacion',
    contenido: `**Mindfulness** o atencion plena es la practica de prestar atencion al momento presente, a proposito y sin juzgar. No es vaciar la mente ni "no pensar" (eso es imposible). Es darte cuenta de lo que pasa, sin engancharte.

La buena noticia: no necesitas templos, almohadones especiales, ni horas libres. Cinco minutos al dia, con constancia, ya generan cambios medibles en el cerebro. Estudios muestran reduccion de ansiedad, mejor sueño y mejor regulacion emocional con apenas 8 semanas de practica diaria corta.

**Por que cuesta tanto:**

Nuestra mente esta entrenada para correr: planificar el dia, repasar lo de ayer, anticipar lo que viene. Cuando intentamos quedarnos en el presente, la mente se rebela. Es normal. **Mindfulness no es lograr que la mente se quede quieta. Es darte cuenta cuando se va y traerla de vuelta, con amabilidad.**

**Cinco minutos al dia: tu primera practica**

1. **Sientate comodo.** Espalda recta pero no rigida. Pies en el piso si estas en silla. Manos sobre las piernas.
2. **Cierra los ojos** o suaviza la mirada al piso.
3. **Lleva la atencion a la respiracion.** No la cambies, no la fuerces. Solo nota: el aire entrando por la nariz, el pecho subiendo, el aire saliendo, el pecho bajando.
4. **Cuando notes que la mente se fue** (pensando en el almuerzo, en la pelea con tu hermano, en la lista del mercado), no te enojes. Sonrie por dentro y vuelve a la respiracion. Esa "vuelta" ES la practica.
5. **Cuando suene la alarma de los 5 minutos**, abre los ojos despacio.

**Errores comunes:**

- "Lo estoy haciendo mal porque me distraigo." NO. Distraerse es parte. La practica es notar y volver.
- "Quiero relajarme." A veces te relajas, a veces te das cuenta que estas tensionado. Ambos son resultados validos.
- "No tengo tiempo." 5 minutos al dia es menos que el tiempo que pasas en redes sociales en un descanso.

**Anclas alternativas a la respiracion:**

Si te cuesta enfocarte en la respiracion, puedes usar:

- **Sonidos del ambiente:** notar todos los sonidos sin nombrarlos.
- **Sensaciones del cuerpo:** el peso de las piernas, el contacto con la silla.
- **Comer con atencion:** un solo bocado, masticando despacio, notando sabor y textura.

**Como crear el habito:**

- Hazlo a la misma hora todos los dias.
- Aprovecha un momento que ya tienes ("despues de cepillarme los dientes en la mañana").
- Empieza con 5 minutos. Despues de un mes, sube a 10. No mas.
- Usa una app gratuita (Insight Timer, por ejemplo) para guiarte si lo necesitas.

**La paradoja:**

Cuando dejas de exigirle a la mente que se quede quieta y solo la observas con curiosidad, se calma sola. Pero ese resultado llega como consecuencia, no como objetivo. La meta es practicar; el resto es bonus.${CIERRE}`,
    autor: 'Equipo MindVenture - Basado en Jon Kabat-Zinn',
    fuente: 'MindVenture - Produccion propia',
  },
  {
    titulo: 'Body scan: la meditacion del recorrido corporal',
    categoria: 'meditacion',
    contenido: `El **body scan** o "recorrido corporal" es una de las practicas mas accesibles de mindfulness. Consiste en pasear la atencion por cada parte del cuerpo, una a una, notando lo que esta ahi sin tratar de cambiarlo.

A diferencia de la meditacion sentada, donde la mente puede sentirse muy abstracta, el body scan ancla la atencion en algo concreto: las sensaciones fisicas. Eso lo hace especialmente util para personas que estan empezando, que viven muy "en la cabeza" o que sufren de ansiedad o tension cronica.

**Beneficios respaldados por la evidencia:**

- Reduce la tension muscular acumulada.
- Mejora el sueño, sobre todo si se hace antes de dormir.
- Aumenta la conciencia corporal (te das cuenta antes cuando estas tensionado).
- Disminuye la rumiacion mental (la mente esta ocupada en el cuerpo, no en los pensamientos).

**Como hacerlo, paso a paso:**

Esta practica dura entre 10 y 20 minutos. Puedes hacerla acostado en la cama o sentado.

1. **Acomodate.** Acostado boca arriba, brazos a los lados, piernas separadas. Si estas sentado, espalda recta y pies en el piso.
2. **Cierra los ojos y respira profundo** tres veces. Suelta el cuerpo en la exhalacion.
3. **Empieza por los pies.** Lleva tu atencion al pie izquierdo. ¿Que sientes ahi? Tal vez calor, frio, hormigueo, peso, nada. No tienes que sentir algo especifico: solo nota. Manten la atencion ahi unos 20-30 segundos.
4. **Sube poco a poco:** tobillo, pantorrilla, rodilla, muslo izquierdo. Repite con el lado derecho.
5. **Pasa por la cadera, gluteos, espalda baja, espalda media, espalda alta.** Si encuentras tension, no luches: respira hacia esa zona y permite que el aire la acaricie.
6. **Sigue por el abdomen, el pecho, los brazos** (de manos a hombros), el cuello, la mandibula, la cara, la cabeza.
7. **Termina sintiendo el cuerpo completo** como un todo. Respira profundo tres veces y abre los ojos despacio.

**Cuando la mente se va:**

Se ira. Es normal. La mente piensa, esa es su naturaleza. Cuando lo notes, no te enojes. Vuelve, con amabilidad, a la parte del cuerpo donde estabas. Volver es la practica.

**Si encuentras zonas dificiles:**

A veces, al llegar a una zona del cuerpo, aparecen emociones (tristeza en el pecho, ansiedad en el estomago, rabia en la mandibula). Esto es comun y sanador. **No huyas ni te aferres.** Solo nota, respira y sigue. Si la emocion es muy fuerte y te cuesta sostenerla, abre los ojos y vuelve al presente con la tecnica 5-4-3-2-1.

**Consejos para crear el habito:**

- **Audios guiados ayudan.** Busca "body scan en español" en YouTube o en apps como Insight Timer.
- **Hazlo de noche** si te cuesta dormir. Muchas personas se duermen antes de terminar.
- **No lo hagas con prisa.** Si solo tienes 5 minutos, haz solo las piernas, mañana sigues.
- **Combina con respiracion 4-7-8** al inicio para profundizar la relajacion.

**Una invitacion:**

El cuerpo guarda lo que la mente no quiere mirar. El body scan es una forma amable de empezar a escuchar al cuerpo. Te dira mas de lo que esperas.${CIERRE}`,
    autor: 'Equipo MindVenture',
    fuente: 'MindVenture - Produccion propia',
  },
];

async function seed() {
  try {
    await connectDB();
    console.log('[Seed] Conectado a MongoDB');

    const eliminados = await Recurso.deleteMany({});
    console.log(
      `[Seed] Coleccion Recurso limpiada (${eliminados.deletedCount} documentos eliminados)`
    );

    const documentos = recursos.map((r) => ({
      ...r,
      tiempoLectura: calcularTiempoLectura(r.contenido),
      publicado: true,
    }));

    const insertados = await Recurso.insertMany(documentos);

    const distribucion = insertados.reduce((acc, r) => {
      acc[r.categoria] = (acc[r.categoria] || 0) + 1;
      return acc;
    }, {});
    const categorias = Object.keys(distribucion);

    console.log('');
    console.log(
      `Seed completado. Insertados: ${insertados.length} recursos en ${categorias.length} categorias.`
    );
    console.log('Distribucion por categoria:', distribucion);
    console.log(
      'Tiempo de lectura promedio:',
      Math.round(
        insertados.reduce((s, r) => s + r.tiempoLectura, 0) / insertados.length
      ),
      'minutos'
    );

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('[Seed] Error:', err);
    try {
      await mongoose.connection.close();
    } catch (_) {
      // ignore
    }
    process.exit(1);
  }
}

seed();
