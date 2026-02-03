'use client'

import { useState, useRef, useEffect } from "react";
import { Send, Bot, X, MessageCircle } from "lucide-react";
import { Button } from "@amap-togo/ui";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// --- KNOWLEDGE BASE ---
const translations = {
    fr: {
        role: "Assistant AMAP",
        status: "En ligne",
        welcome: "Bonjour ! 🌿 Je suis l'assistant d'AMAP Togo. Je connais tout sur nos paniers bio, notre fonctionnement, et nos valeurs. Posez-moi une question !",
        placeholder: "Ex: C'est quoi une AMAP ?",
        thinking: "Je réfléchis...",
        responses: {
            default: "Hmm, je ne suis pas sûr de comprendre. 🤔\nEssayez avec des mots simples comme :\n• Paniers (prix, contenu)\n• Livraison (zones, frais)\n• Inscription (comment faire)\n• AMAP (c'est quoi ?)",
            greeting: "Bonjour ! 👋 Ravi de vous voir. Je suis là pour vous aider à manger sain et local.",

            // Concepts Généraux
            amap_def: "AMAP signifie Association pour le Maintien d'une Agriculture Paysanne. \n🤝 C'est un partenariat solidaire entre vous (consommateur) et nos producteurs locaux. Vous commandez à l'avance, ils cultivent pour vous.",
            tout: "On fait plein de choses ! 🌍\nEn résumé : AMAP Togo vous livre chaque semaine des paniers de fruits et légumes bio 🥕, cultivés à Kpalimé et livrés à Lomé.\n\nC'est sain, c'est local, et ça soutient nos paysans. Ça vous tente ?",
            fonctionnement: "C'est très simple (1-2-3) :\n1️⃣ Vous vous abonnez (formule hebdo ou mensuelle).\n2️⃣ Nos paysans récoltent vos légumes la veille.\n3️⃣ Nous vous livrons chez vous ou en point relais.\n\nOn commence ?",

            // Détails Produits & Paniers
            panier: "Nos paniers sont des surprises de la nature ! 🎁\nIls changent chaque semaine selon la récolte.\n\n🧺 Panier Solo/Duo (~3000F) : Parfait pour 1 ou 2 personnes.\n🧺 Panier Famille (~5000F) : Pour 4 à 5 personnes.\n\nTout est bio certifié.",
            produits: "Que du bon ! 🍅🥬\nOn a des tomates, carottes, concombres, laitues, aubergines... mais aussi des fruits (papayes, bananes) et des tubercules (ignames). \n\nC'est le goût du vrai terroir togolais.",
            bio: "Absolument ! 🐞\nZéro chimie, zéro pesticide de synthèse. On utilise du compost, du purin d'ortie et des techniques ancestrales. \nVotre santé vous dira merci !",

            // Logistique
            livraison: "On livre partout à Lomé ! 🛵\n📆 Jours de livraison : Mercredi et Samedi.\n📍 Chez vous : Frais selon le quartier (500-1500F).\n📍 Point Relais : Moins cher, à récupérer à Agoè, Tokoin, ou Adidogomé.",
            paiement: "Vous pouvez payer par T-Money, Flooz ou en espèces à la livraison. C'est flexible ! 💸",

            // Actions
            commande: "Pour commander, il faut s'inscrire :\n1. Cliquez sur 'S'inscrire' en haut.\n2. Créez votre compte.\n3. Choisissez votre abonnement.\n\nC'est sans engagement de durée !",
            contact: "Un humain ? Pas de souci ! 📞\nAppelez le service client au +228 90 00 00 00 ou écrivez à contact@amaptogo.com.",

            // Politesse
            merci: "Avec plaisir ! 🙏 N'oubliez pas : manger bio, c'est soutenir le Togo. À bientôt !",
            oui_commande: "Génial ! Cliquez vite sur le bouton 'S'inscrire' en haut à droite. On vous attend dans la famille AMAP ! 💚",
            non_merci: "Ça marche. Prenez votre temps pour visiter le site. Je suis là si vous changez d'avis. 🍃"
        }
    },
    en: {
        role: "AMAP Assistant",
        status: "Online",
        welcome: "Hello! 🌿 I'm the AMAP Togo assistant. I know everything about our organic baskets, how it works, and our values. Ask me anything!",
        placeholder: "Ex: What is AMAP?",
        thinking: "Thinking...",
        responses: {
            default: "Hmm, not sure I get it. 🤔\nTry keywords like:\n• Baskets (price, content)\n• Delivery (areas, fees)\n• Sign up (how to)\n• AMAP (definition)",
            greeting: "Hello! 👋 Great to see you. I'm here to help you eat healthy and local.",

            amap_def: "AMAP stands for Association for the Maintenance of Peasant Agriculture. \n🤝 It's a solidarity partnership between you and local farmers. You order, they grow. Win-win!",
            tout: "We do a lot! 🌍\nIn short: AMAP Togo delivers weekly organic fruit & veg baskets 🥕, grown in Kpalimé and delivered in Lomé.\n\nIt's healthy, local, and supports farmers. Interested?",
            fonctionnement: "It's easy as 1-2-3:\n1️⃣ Subscribe (weekly or monthly).\n2️⃣ Farmers harvest your veggies fresh.\n3️⃣ We deliver to your door or pickup point.\n\nReady to start?",

            panier: "Our baskets are nature's surprises! 🎁\nVarying weekly based on harvest.\n\n🧺 Solo/Duo (~3000F): Perfect for 1-2 people.\n🧺 Family (~5000F): For 4-5 people.\n\nAll 100% certified organic.",
            produits: "Only the best! 🍅🥬\nTomatoes, carrots, lettuce, eggplant... plus fruits (papaya, bananas) and tubers (yams). \n\nThe taste of real Togolese soil.",
            bio: "Absolutely! 🐞\nZero chemicals, zero synthetic pesticides. We use natural compost and traditional methods. \nYour health will thank you!",

            livraison: "We deliver all over Lomé! 🛵\n📆 Days: Wednesday & Saturday.\n📍 Home: Fee depends on area.\n📍 Pickup: Cheaper, at Agoè, Tokoin, or Adidogomé.",
            paiement: "Pay via T-Money, Flooz or Cash on delivery. Flexible! 💸",

            commande: "To order, you need to sign up:\n1. Click 'Sign Up' at the top.\n2. Create account.\n3. Choose subscription.\n\nNo long-term commitment!",
            contact: "Need a human? 📞\nCall +228 90 00 00 00 or email contact@amaptogo.com.",

            merci: "My pleasure! 🙏 Remember: eating organic supports Togo. See you!",
            oui_commande: "Awesome! Click 'Sign Up' top right. We're waiting for you in the AMAP family! 💚",
            non_merci: "Alright. Take your time browsing. I'm here if you change your mind. 🍃"
        }
    },
    es: {
        role: "Asistente AMAP",
        status: "En línea",
        welcome: "¡Hola! 🌿 Soy el asistente de AMAP Togo. Sé todo sobre nuestras cestas bio, cómo funciona y nuestros valores. ¡Pregúnteme!",
        placeholder: "Ej: ¿Qué es AMAP?",
        thinking: "Pensando...",
        responses: {
            default: "Mmm, no estoy seguro. 🤔\nPruebe palabras clave como:\n• Cestas (precio, contenido)\n• Entrega (zonas)\n• Registro (cómo)\n• AMAP (definición)",
            greeting: "¡Hola! 👋 Un placer. Estoy aquí para ayudarle a comer sano y local.",

            amap_def: "AMAP significa Asociación para el Mantenimiento de la Agricultura Campesina. \n🤝 Es una alianza solidaria entre usted y los productores.",
            tout: "¡Hacemos mucho! 🌍\nResumen: AMAP Togo entrega cestas de frutas y verduras bio 🥕 cada semana en Lomé.\n\nSano, local y solidario. ¿Le interesa?",
            fonctionnement: "Es fácil (1-2-3):\n1️⃣ Suscríbase.\n2️⃣ Cosechamos sus verduras.\n3️⃣ Entregamos en su casa o punto de recogida.\n\n¿Empezamos?",

            panier: "¡Nuestras cestas son sorpresas! 🎁\nCambian cada semana.\n\n🧺 Solo/Dúo (~3000F): Para 1-2 personas.\n🧺 Familiar (~5000F): Para 4-5 personas.\n\nTodo 100% orgánico.",
            produits: "¡Solo lo bueno! 🍅🥬\nTomates, zanahorias, lechuga... y frutas (papaya, bananas).\n\nEl sabor de la tierra togolesa.",
            bio: "¡Absolutamente! 🐞\nCero químicos. Usamos compost natural. \n¡Su salud se lo agradecerá!",

            livraison: "¡Entregamos en todo Lomé! 🛵\n📆 Días: Miércoles y Sábado.\n📍 A domicilio: Tarifa según zona.\n📍 Punto de recogida: Agoè, Tokoin, Adidogomé.",
            paiement: "Pague con T-Money, Flooz o Efectivo. ¡Flexible! 💸",

            commande: "Para pedir:\n1. Clic en 'Registrarse' arriba.\n2. Cree cuenta.\n3. Elija suscripción.\n\n¡Sin compromiso!",
            contact: "¿Necesita un humano? 📞\nLlame al +228 90 00 00 00 o email contact@amaptogo.com.",

            merci: "¡Un placer! 🙏 Comer bio es apoyar a Togo. ¡Hasta pronto!",
            oui_commande: "¡Genial! Haga clic en 'Registrarse' arriba. ¡Le esperamos! 💚",
            non_merci: "Vale. Tómese su tiempo. Estoy aquí si me necesita. 🍃"
        }
    }
};

type ContextType = "none" | "offering_baskets" | "offering_signup" | "asking_location";

type Message = {
    role: "user" | "bot";
    content: string;
};

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [currentLang, setCurrentLang] = useState<"fr" | "en" | "es">("fr");
    const [context, setContext] = useState<ContextType>("none");

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Initialize welcome message
    useEffect(() => {
        if (messages.length === 0) {
            setMessages([{ role: "bot", content: translations[currentLang].welcome }]);
        }
    }, [currentLang]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen, isTyping]);

    const detectLanguage = (text: string) => {
        const lower = text.toLowerCase();
        if (lower.match(/\b(hello|hi|how|what|basket|price)\b/)) return "en";
        if (lower.match(/\b(hola|como|que|precio|cesta)\b/)) return "es";
        return "fr";
    };

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim()) return;

        const userMessage = input;
        setInput("");
        setMessages(prev => [...prev, { role: "user", content: userMessage }]);
        setIsTyping(true);

        setTimeout(() => {
            const detectedLang = detectLanguage(userMessage);
            let activeLang = currentLang;

            // Switch lang auto
            if (detectedLang !== currentLang && userMessage.toLowerCase().match(/\b(hello|hi|hola|buenos)\b/)) {
                setCurrentLang(detectedLang);
                activeLang = detectedLang;
            }

            const r = translations[activeLang].responses;
            let botResponse = r.default;
            let nextContext: ContextType = "none";

            const lowerInput = userMessage.toLowerCase();

            // --- CONTEXT FLOW ---
            if (context === "offering_baskets" || context === "offering_signup") {
                if (lowerInput.match(/\b(oui|yes|si|d'accord|ok|volontiers|bien sur|absolument|grave|c'est parti)\b/)) {
                    botResponse = r.oui_commande;
                    nextContext = "none";
                } else if (lowerInput.match(/\b(non|no|pas|bof|later|plus tard|jamais)\b/)) {
                    botResponse = r.non_merci;
                    nextContext = "none";
                }
            }

            // --- SMART MATCHING ---

            // 1. Definition & Global Info
            if (lowerInput.match(/(c'est quoi|cest quoi|qu'est ce que|quest ce que|signifie|definis|definition|qui etes vous|presentation)\s*amap/)) {
                botResponse = r.amap_def;
            }
            else if (lowerInput.match(/(tout|infos|information|renseigne|savoir|general|resume|global)/)) {
                botResponse = r.tout;
                nextContext = "offering_signup"; // Asking about everything usually leads to wanting to join
            }
            else if (lowerInput.match(/(comment|how)\s*(ca marche|fonctionne|marche|marchez|work|works)/)) {
                botResponse = r.fonctionnement;
                nextContext = "offering_signup";
            }

            // 2. Specific Topics
            else if (lowerInput.match(/(panier|basket|cesta|formule|offre|abonnement)/)) {
                botResponse = r.panier;
                nextContext = "offering_baskets";
            }
            else if (lowerInput.match(/(prix|tarif|price|cout|combien|cost|argent|payer|paye|facture)/)) {
                // Combine pricing with baskets info or payment info
                if (lowerInput.match(/(moyen|mode|comment)/)) botResponse = r.paiement;
                else botResponse = r.panier; // Price usually implies baskets
            }
            else if (lowerInput.match(/(livraison|livrer|delivery|entrega|place|lieu|zone|lome|lomé|quartier|domicile|relais|point|recuperer)/)) {
                botResponse = r.livraison;
                nextContext = "asking_location";
            }
            else if (lowerInput.match(/(produit|product|legume|vegetable|fruit|tomate|carotte|igname|miam|frais|qualite|bon|manger|contenu|qu'y a t il|dans)/)) {
                botResponse = r.produits;
            }
            else if (lowerInput.match(/(contact|telephone|phone|tel|email|mail|parler|humain|support|aide|help|joindre|appeler)/)) {
                botResponse = r.contact;
            }
            else if (lowerInput.match(/(commande|commander|order|acheter|buy|comprar|compte|inscrip|register|demarrer|start|commencer)/)) {
                botResponse = r.commande;
                nextContext = "offering_signup";
            }
            else if (lowerInput.match(/(bio|organi|naturel|chimique|pesticide|sain|sante|healthy|label|certifi)/)) {
                botResponse = r.bio;
            }

            // 3. Chit-Chat / Greetings
            else if (lowerInput.match(/\b(bonjour|hello|hola|salut|coucou|hi|yo|wesh|bonsoir)\b/)) {
                botResponse = r.greeting;
            }
            else if (lowerInput.match(/\b(merci|thank|gracias|top|super|cool|genial|parfait)\b/)) {
                botResponse = r.merci;
            }
            // 4. Context Fallback (if they answer a location for example)
            else if (context === "asking_location") {
                botResponse = "Parfait ! Nous desservons probablement ce quartier. Le tarif exact s'affichera lors de votre commande.";
                nextContext = "none";
            }

            setContext(nextContext);
            setMessages(prev => [...prev, { role: "bot", content: botResponse }]);
            setIsTyping(false);
        }, 1000); // Faster response
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="mb-4 w-[350px] sm:w-[380px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[500px]"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 flex items-center justify-between text-white shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10">
                                    <Bot className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">{translations[currentLang].role}</h3>
                                    <p className="text-xs text-green-100 flex items-center gap-1">
                                        <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
                                        {translations[currentLang].status}
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsOpen(false)}
                                className="hover:bg-white/20 text-white rounded-full h-8 w-8"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                            {messages.map((m, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className={cn(
                                        "flex w-full",
                                        m.role === "user" ? "justify-end" : "justify-start"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "max-w-[85%] p-3 rounded-2xl text-sm shadow-sm whitespace-pre-line",
                                            m.role === "user"
                                                ? "bg-green-600 text-white rounded-tr-none"
                                                : "bg-white text-gray-700 border border-gray-100 rounded-tl-none"
                                        )}
                                    >
                                        {m.content}
                                    </div>
                                </motion.div>
                            ))}

                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-3 bg-white border-t border-gray-100">
                            {/* Language Switcher */}
                            <div className="flex justify-center gap-2 mb-2">
                                {(['fr', 'en', 'es'] as const).map((lang) => (
                                    <button
                                        key={lang}
                                        onClick={() => setCurrentLang(lang)}
                                        className={cn(
                                            "text-[10px] px-2 py-0.5 rounded-full border transition-all",
                                            currentLang === lang
                                                ? "bg-green-100 border-green-500 text-green-700 font-bold"
                                                : "border-gray-200 text-gray-400 hover:border-gray-300"
                                        )}
                                    >
                                        {lang.toUpperCase()}
                                    </button>
                                ))}
                            </div>

                            <form
                                onSubmit={handleSend}
                                className="flex gap-2"
                            >
                                <input
                                    ref={inputRef}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder={translations[currentLang].placeholder}
                                    className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder:text-gray-400"
                                />
                                <Button
                                    type="submit"
                                    size="icon"
                                    disabled={!input.trim()}
                                    className="rounded-full bg-green-600 hover:bg-green-700 text-white shadow-md shadow-green-500/20 w-10 h-10 shrink-0"
                                >
                                    <Send className="w-4 h-4" />
                                </Button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="h-14 w-14 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30 flex items-center justify-center hover:from-green-600 hover:to-emerald-700 transition-all z-50"
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                        >
                            <X className="w-7 h-7" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="open"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                        >
                            <MessageCircle className="w-7 h-7" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>
        </div>
    )
}
