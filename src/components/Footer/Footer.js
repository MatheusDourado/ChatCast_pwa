import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

export default function Footer () {
    return (
        <footer>
            <section className="fixed bottom-0 left-0 w-full p-4 text-center font-semibold">
                <span> Criado por Matheus Dourado <FontAwesomeIcon icon={faHeart} color="#236E8C" /> </span>
            </section>
        </footer>
    )
}

