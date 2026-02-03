import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';

// Autoriser l'edge runtime pour des réponses plus rapides
export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages } = await req.json();

    console.log('API Chat Request received with messages:', messages.length);

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!apiKey) {
        console.error('API Key is missing');
        return new Response('Missing API Key', { status: 500 });
    }

    const google = createGoogleGenerativeAI({
        apiKey: apiKey,
    });

    try {
        const result = await generateText({
            model: google('gemini-1.5-flash'),
            system: `Tu es l'assistant virtuel expert d'AMAP Togo (Association pour le Maintien d'une Agriculture Paysanne).
    
    TON RÔLE :
    - Accueillir les visiteurs chaleureusement.
    - Répondre aux questions sur les paniers, les produits, et le fonctionnement.
    - Encourager à l'inscription et à la commande.
    
    INFORMATIONS CLÉS :
    1. **Concept** : AMAP Togo met en lien direct les consommateurs et les producteurs locaux bio. Pas d'intermédiaire.
    2. **Produits** : 100% Bio, cultivés au Togo (Lomé et environs de Kpalimé). Légumes (tomates, gombo, gboma, ademe, carottes), fruits (bananes, papaye), tubercules (igname, manioc).
    3. **Paniers** :
       - **Panier Solo/Duo (Petit)** : ~3000 FCFA (Prix indicatif, varie selon contenu). Pour 1-2 pers.
       - **Panier Famille (Grand)** : ~5000 FCFA. Pour 4-5 pers.
       - **Panier 100% Local** : Uniquement légumes feuilles et tubercules locaux.
    4. **Livraison** : 
       - À domicile sur Lomé (frais selon zone, généralement 500-1000 FCFA).
       - Points relais disponibles (quartier Tokoin, Agoè).
    5. **Commande** : Tout se fait sur le site. Il faut créer un compte, choisir son panier, et valider.
    
    TON DE VOIX :
    - Amical, serviable, professionnel mais proche (esprit communautaire).
    - Utilise des émojis 🍅🥬 pour rendre la conversation vivante.
    - Si tu ne connais pas une réponse précise (ex: "est-ce qu'il y a des fraises aujourd'hui ?"), invite l'utilisateur à vérifier la page "Produits" du site car les stocks changent chaque semaine.

    RÈGLES :
    - Ne jamais inventer de prix s'ils ne sont pas dans tes connaissances.
    - Répondre en français.
    - Rester concis (pas de pavés de texte).
    `,
            messages,
        });

        return Response.json({ text: result.text });
    } catch (error) {
        console.error('Error in chat API:', error);
        return new Response('Error processing chat request', { status: 500 });
    }
}
