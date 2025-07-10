import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

export default function Home() {
  const { user, token, loading } = useAuth();
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const [roomId, setRoomId] = useState('');
  const [players, setPlayers] = useState([]);
  const [message, setMessage] = useState('');
  const [gameStarted, setGameStarted] = useState(false);

  // Redirect to signin if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/signin');
    }
  }, [user, loading, navigate]);

  // Connect to Socket.IO with JWT
  useEffect(() => {
    if (user && token) {
      socketRef.current = io('http://localhost:5001', {
        auth: { token }
      });

      // Listen for welcome message
      socketRef.current.on('welcome', (msg) => {
        setMessage(msg);
      });

      // Listen for player list updates
      socketRef.current.on('player_list', (playerList) => {
        setPlayers(playerList);
      });

      // Listen for game start
      socketRef.current.on('game_start', (msg) => {
        setMessage(msg);
        setGameStarted(true);
      });

      // Listen for room full error
      socketRef.current.on('room_full', (msg) => {
        setMessage(msg);
      });

      // Clean up on unmount
      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
      };
    }
  }, [user, token]);

  const handleJoinRoom = () => {
    if (roomId.trim() && socketRef.current) {
      socketRef.current.emit('join_room', roomId);
      setMessage('Joining room...');
    }
  };

  const handleCreateRoom = () => {
    const newRoomId = Math.random().toString(36).substring(2, 8);
    setRoomId(newRoomId);
    if (socketRef.current) {
      socketRef.current.emit('join_room', newRoomId);
      setMessage('Creating and joining room...');
    }
  };

  if (loading || !user) return <div>Loading...</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto bg-pink-100 h-screen">
      <h2 className="text-3xl font-bold mb-6 text-pink-700">Welcome to War, {user.name}!</h2>
      
      {message && (
        <div className="mb-4 p-3 bg-pink-100 text-pink-800 rounded">
          {message}
        </div>
      )}

      {!gameStarted && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">Join or Create a Game</h3>
          
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="Enter room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="flex-1 p-2 border border-pink-300 rounded"
            />
            <button
              onClick={handleJoinRoom}
              className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
            >
              Join Room
            </button>
          </div>
          
          <button
            onClick={handleCreateRoom}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Create New Room
          </button>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Players in Room:</h3>
        {players.length === 0 ? (
          <p className="text-gray-600">No players yet</p>
        ) : (
          <ul className="space-y-2">
            {players.map((player, idx) => (
              <li key={idx} className="p-2 bg-pink-50 rounded">
                {player.name} {player.id === user.id && '(You)'}
              </li>
            ))}
          </ul>
        )}
      </div>

      {gameStarted && (
        <div className="p-4 bg-green-100 text-green-800 rounded">
          <h3 className="text-lg font-semibold">Game Started!</h3>
          <p>Game logic will be implemented here...</p>
        </div>
      )}
    </div>
  );
}