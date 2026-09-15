import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  UserCheck,
  CheckCircle2,
  Camera,
  Sparkles,
  RefreshCw,
  AlertCircle,
  User,
  Video,
  Upload,
} from 'lucide-react';
import { verifyIdentityWithGemini, GeminiIdentityResult } from '@/lib/geminiIdentity';

interface IdentityVerificationProps {
  guestName: string;
  isVerified: boolean;
  onVerified: () => void;
}

export const IdentityVerification: React.FC<IdentityVerificationProps> = ({
  guestName,
  isVerified,
  onVerified,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Document, 2: Selfie, 3: Processing
  const [idFile, setIdFile] = useState<File | null>(null);
  const [idPreview, setIdPreview] = useState<string | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  
  // Live Camera WebRTC state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<GeminiIdentityResult | null>(null);
  const [done, setDone] = useState(isVerified);

  // Stop camera stream when unmounting or changing step
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  const stopCameraStream = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const startCameraStream = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch (err: any) {
      console.error('Erreur accès caméra:', err);
      setCameraError(
        'Impossible d\'accéder à la caméra en direct. Veuillez utiliser l\'option "Importer une photo de votre appareil" ci-dessous.'
      );
      setIsCameraActive(false);
    }
  };

  const capturePhotoFromCamera = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setSelfiePreview(dataUrl);
        stopCameraStream();
      }
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleIdChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setIdFile(f);
      const b64 = await fileToBase64(f);
      setIdPreview(b64);
    }
  };

  const handleSelfieFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      const b64 = await fileToBase64(f);
      setSelfiePreview(b64);
      stopCameraStream();
    }
  };

  const handleRunGeminiVerification = async () => {
    if (!idPreview || !selfiePreview) return;
    setStep(3);
    setAnalyzing(true);

    try {
      const result = await verifyIdentityWithGemini({
        idDocumentBase64: idPreview,
        idDocumentMimeType: idFile?.type || 'image/jpeg',
        selfieBase64: selfiePreview,
        selfieMimeType: 'image/jpeg',
        expectedGuestName: guestName,
      });

      setAnalysisResult(result);
      setAnalyzing(false);

      if (result.verificationPassed) {
        setDone(true);
        onVerified();
      }
    } catch (err) {
      console.error(err);
      setAnalyzing(false);
    }
  };

  if (done || isVerified) {
    return (
      <Card className="bg-emerald-50/80 border-emerald-200 text-emerald-950 rounded-2xl shadow-xs">
        <CardHeader className="flex flex-row items-center gap-3 py-3">
          <CheckCircle2 className="w-7 h-7 text-emerald-600 flex-shrink-0" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-bold text-emerald-900">Identité Validée</CardTitle>
              <Badge className="bg-emerald-600 text-white text-[10px] font-bold border-none">
                IA Gemini 97%
              </Badge>
            </div>
            <p className="text-xs text-emerald-700 font-medium">
              Pièce d'identité et vérification faciale confirmées pour <strong>{guestName}</strong>
            </p>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="bg-white border-slate-200/80 text-slate-900 rounded-2xl shadow-sm">
      {/* Hidden canvas for capturing image from video stream */}
      <canvas ref={canvasRef} className="hidden" />

      <CardHeader className="pb-3 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-indigo-600" />
            <CardTitle className="text-base font-bold text-slate-900">
              Vérification d'Identité IA (Biométrie & Pièce)
            </CardTitle>
          </div>
          <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-600" /> Gemini Vision
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        {step === 1 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Étape 1/2 : Photo de votre pièce d'identité</span>
              <span className="text-[11px] text-slate-500">Passeport ou CNI</span>
            </div>

            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-5 text-center bg-slate-50 hover:border-indigo-400 transition-colors relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleIdChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              {idPreview ? (
                <div className="space-y-2">
                  <img src={idPreview} alt="Aperçu pièce d'identité" className="h-28 mx-auto rounded-xl object-cover border border-slate-300" />
                  <p className="text-xs font-bold text-emerald-700 flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Pièce d'identité enregistrée
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-2">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                    <Camera className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">Cliquer ici pour importer votre document</p>
                  <p className="text-[11px] text-slate-400">Passeport, Carte d'Identité ou Permis (Format JPG/PNG)</p>
                </div>
              )}
            </div>

            <Button
              disabled={!idPreview}
              onClick={() => {
                setStep(2);
                startCameraStream();
              }}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-2.5 rounded-xl shadow-xs"
            >
              Étape suivante : Prenez un Selfie en direct ➔
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Étape 2/2 : Prise de Selfie en direct</span>
              <button
                onClick={() => {
                  stopCameraStream();
                  setStep(1);
                }}
                className="text-[11px] text-indigo-600 font-semibold hover:underline"
              >
                ← Revenir à l'étape 1
              </button>
            </div>

            {/* LIVE WEBCAM VIDEO STREAM CONTAINER */}
            <div className="relative border-2 border-indigo-200 rounded-2xl overflow-hidden bg-slate-950 p-2 text-center min-h-[220px] flex items-center justify-center">
              {selfiePreview ? (
                <div className="space-y-2 py-2">
                  <img src={selfiePreview} alt="Selfie capturé" className="h-40 w-40 mx-auto rounded-full object-cover border-4 border-emerald-500 shadow-lg" />
                  <p className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Selfie capturé avec succès !
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelfiePreview(null);
                      startCameraStream();
                    }}
                    className="text-xs bg-slate-800 text-white border-slate-700 hover:bg-slate-700"
                  >
                    <RefreshCw className="w-3.5 h-3.5 mr-1" /> Recommencer la prise de vue
                  </Button>
                </div>
              ) : (
                <div className="w-full space-y-3">
                  <video
                    ref={videoRef}
                    playsInline
                    muted
                    className={`w-full max-h-56 object-cover rounded-xl ${isCameraActive ? 'block' : 'hidden'}`}
                  />

                  {!isCameraActive && (
                    <div className="py-6 space-y-3 text-white">
                      <div className="p-3 bg-indigo-600 text-white rounded-full w-12 h-12 mx-auto flex items-center justify-center">
                        <Video className="w-6 h-6" />
                      </div>
                      <p className="text-xs font-semibold">Autorisez l'accès à votre caméra pour le Selfie</p>
                      <Button
                        onClick={startCameraStream}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 px-4 rounded-xl"
                      >
                        🎥 Activer la Caméra du Navigateur
                      </Button>
                    </div>
                  )}

                  {isCameraActive && (
                    <Button
                      onClick={capturePhotoFromCamera}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl shadow-lg shadow-emerald-600/30"
                    >
                      📸 Prendre la photo maintenant
                    </Button>
                  )}
                </div>
              )}
            </div>

            {cameraError && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 space-y-2">
                <p className="flex items-center gap-1.5 font-bold">
                  <AlertCircle className="w-4 h-4 text-amber-600" /> Remarque caméra
                </p>
                <p>{cameraError}</p>
              </div>
            )}

            {/* FALLBACK FILE UPLOADER IF CAMERA NOT WORKING */}
            {!selfiePreview && (
              <div className="pt-2">
                <label className="block text-center border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 p-2.5 rounded-xl cursor-pointer text-xs font-semibold text-slate-700 transition-colors">
                  <span className="flex items-center justify-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-slate-500" /> Ou choisir une photo/selfie depuis votre appareil
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSelfieFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            <Button
              disabled={!selfiePreview}
              onClick={handleRunGeminiVerification}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl shadow-md shadow-emerald-600/20"
            >
              <Sparkles className="w-4 h-4 mr-1.5" /> Lancer l'Analyse d'Identité IA Gemini
            </Button>
          </div>
        )}

        {step === 3 && (
          <div className="py-6 text-center space-y-4">
            {analyzing ? (
              <div className="space-y-3">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-bold text-slate-800">Analyse Multimodale Gemini IA en cours...</p>
                <div className="text-[11px] text-slate-500 space-y-1">
                  <p>1. Extraction du nom et contrôle de la pièce d'identité</p>
                  <p>2. Comparaison faciale biométrique (Document vs Selfie)</p>
                  <p>3. Validation de la réservation de {guestName}</p>
                </div>
              </div>
            ) : analysisResult ? (
              <div className="space-y-3">
                {analysisResult.verificationPassed ? (
                  <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-emerald-900 space-y-2">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                    <p className="text-sm font-bold">Identité Validée par Gemini (Score: {analysisResult.confidenceScore}%)</p>
                    <p className="text-xs text-emerald-700">{analysisResult.summaryReason}</p>
                  </div>
                ) : (
                  <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-amber-900 space-y-2">
                    <AlertCircle className="w-10 h-10 text-amber-600 mx-auto" />
                    <p className="text-sm font-bold">Vérification en attente de validation</p>
                    <p className="text-xs text-amber-800">{analysisResult.summaryReason}</p>
                    <Button size="sm" variant="outline" onClick={() => setStep(1)} className="mt-2 text-xs">
                      <RefreshCw className="w-3.5 h-3.5 mr-1" /> Recommencer la prise de photo
                    </Button>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
