import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonInput,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
  IonToast,
} from '@ionic/react';
import { lockClosed, lockOpen, copyOutline, swapVerticalOutline } from 'ionicons/icons';

const Home: React.FC = () => {
  const [method, setMethod] = useState<string>('caesar');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [inputText, setInputText] = useState<string>('');
  const [outputText, setOutputText] = useState<string>('');
  const [shiftKey, setShiftKey] = useState<number>(3);
  const [showToast, setShowToast] = useState<boolean>(false);

  // Cipher Logic
  const processCaesar = (text: string, shift: number, decrypt = false) => {
    let s = decrypt ? (26 - (shift % 26)) % 26 : shift % 26;
    return text.replace(/[a-zA-Z]/g, (char) => {
      const base = char >= 'a' ? 97 : 65;
      return String.fromCharCode(((char.charCodeAt(0) - base + s) % 26) + base);
    });
  };

  const processBase64 = (text: string, decrypt = false) => {
    try {
      return decrypt ? atob(text) : btoa(text);
    } catch {
      return 'Invalid Base64 input';
    }
  };

  const handleProcess = () => {
    if (!inputText) {
      setOutputText('');
      return;
    }
    const isDecrypt = mode === 'decrypt';
    if (method === 'caesar') {
      setOutputText(processCaesar(inputText, shiftKey, isDecrypt));
    } else if (method === 'base64') {
      setOutputText(processBase64(inputText, isDecrypt));
    }
  };

  const copyToClipboard = () => {
    if (outputText) {
      navigator.clipboard.writeText(outputText);
      setShowToast(true);
    }
  };

  const handleSwap = () => {
    setInputText(outputText);
    setOutputText('');
    setMode(mode === 'encrypt' ? 'decrypt' : 'encrypt');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Encryption Suite</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Algorithm & Options</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonItem>
              <IonLabel>Algorithm</IonLabel>
              <IonSelect value={method} onIonChange={(e) => setMethod(e.detail.value)}>
                <IonSelectOption value="caesar">Caesar Cipher</IonSelectOption>
                <IonSelectOption value="base64">Base64 Encoding</IonSelectOption>
              </IonSelect>
            </IonItem>

            {method === 'caesar' && (
              <IonItem>
                <IonLabel position="stacked">Shift Key (1-25)</IonLabel>
                <IonInput
                  type="number"
                  value={shiftKey}
                  onIonChange={(e) => setShiftKey(parseInt(e.detail.value!, 10) || 1)}
                />
              </IonItem>
            )}

            <IonItem>
              <IonLabel>Mode</IonLabel>
              <IonSelect value={mode} onIonChange={(e) => setMode(e.detail.value)}>
                <IonSelectOption value="encrypt">Encrypt</IonSelectOption>
                <IonSelectOption value="decrypt">Decrypt</IonSelectOption>
              </IonSelect>
            </IonItem>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Input Text</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonTextarea
              rows={4}
              placeholder="Enter text here..."
              value={inputText}
              onIonChange={(e) => setInputText(e.detail.value!)}
            />
            <IonButton expand="block" onClick={handleProcess} style={{ marginTop: '10px' }}>
              <IonIcon slot="start" icon={mode === 'encrypt' ? lockClosed : lockOpen} />
              {mode === 'encrypt' ? 'Encrypt Text' : 'Decrypt Text'}
            </IonButton>
          </IonCardContent>
        </IonCard>

        {outputText && (
          <IonCard color="light">
            <IonCardHeader>
              <IonCardTitle>Result</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonTextarea rows={4} readonly value={outputText} />
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <IonButton fill="outline" onClick={copyToClipboard} style={{ flex: 1 }}>
                  <IonIcon slot="start" icon={copyOutline} /> Copy
                </IonButton>
                <IonButton fill="outline" onClick={handleSwap} style={{ flex: 1 }}>
                  <IonIcon slot="start" icon={swapVerticalOutline} /> Swap
                </IonButton>
              </div>
            </IonCardContent>
          </IonCard>
        )}

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message="Copied to clipboard!"
          duration={1500}
        />
      </IonContent>
    </IonPage>
  );
};

export default Home;